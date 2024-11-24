use postgres_array::Array;
use std::io::{self, Error};
use std::process::{Command, Output, Stdio};
use tokio_postgres::Client;

async fn generate_image(
    cards: &Vec<String>,
    target: &str,
    bin: &str,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let args_1: [&str; 10] = [
        "-border", "30", "-resize", "50%", "-filter", "Lanczos", "-quality", "100", "+append", "-",
    ];

    let args_2: [&str; 5] = ["-", "-border", "15x15", "-strip", target];

    let aggregate = Command::new(bin)
        .args(cards)
        .args(args_1)
        .stdout(Stdio::piped())
        .spawn()?;

    let aggregate_output = aggregate
        .stdout
        .ok_or_else(|| io::Error::new(io::ErrorKind::Other, "Failed to aggregate images"))?;

    let add_border = Command::new(bin)
        .args(args_2)
        .stdin(Stdio::from(aggregate_output))
        .spawn()?;

    let add_border_output = add_border.wait_with_output()?;
    if !add_border_output.status.success() {
        return Err(Box::new(io::Error::new(
            io::ErrorKind::Other,
            format!(
                "Failed to add border: {} HINT: create imagen/newCards folder for the generated images",
                add_border_output.status
            ),
        )));
    }

    Ok(())
}

async fn optimize_image(target: &str) -> Result<Output, Error> {
    let args: [String; 5] = [
        String::from("-strip"),
        String::from("all"),
        String::from("-o7"),
        String::from("-zm1-9"),
        target.to_owned(),
    ];

    Command::new("optipng").args(&args).output()
}

pub async fn process(
    game_id: String,
    card_index: usize,
    cards_amount: usize,
    client: &Client,
) -> Result<(Vec<String>, String), Box<dyn std::error::Error>> {
    let bin = if cfg!(windows) { "magick" } else { "convert" };

    let row = &client
        .query_one(
            &format!("SELECT {} FROM game WHERE id=$1", &"deck"),
            &[&game_id],
        )
        .await?;

    let cards_raw: Array<String> = row.get(&"deck");
    let cards_vec: Vec<String> =
        cards_raw.into_inner()[card_index..cards_amount * 2 + card_index].to_vec();

    let mut cards: Vec<String> = vec![];
    let mut target = String::from("");

    for card in cards_vec.chunks(2) {
        target.push_str(&format!("{}{}", &card[0], &card[1]));
        cards.push(format!("cards/{}{}.png", card[0], card[1]));
    }

    target = format!("newCards/{}.png", target);

    generate_image(&cards, &target, bin)
        .await
        .expect("Failed to generate image");

    optimize_image(&target)
        .await
        .expect("Failed to optimize image");

    Ok((cards, target))
}
