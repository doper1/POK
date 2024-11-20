use std::io::{self, Error};
use std::process::{Command, Output, Stdio};
use tokio;

pub async fn generate_image(
    cards: &Vec<String>,
    target: &str,
    bin: &str,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let args_1: [&str; 10] = [
        "-border", "30", "-resize", "40%", "-filter", "Lanczos", "-quality", "100", "+append", "-",
    ];

    let args_2: [&str; 5] = ["-", "-border", "10x10", "-strip", target];

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
                "Failed to add border: {}\nhint: create /newCards folder for the generated images",
                add_border_output.status
            ),
        )));
    }

    Ok(())
}

pub async fn optimize_image(target: &str) -> Result<Output, Error> {
    let args: [String; 5] = [
        String::from("-strip"),
        String::from("all"),
        String::from("-o7"),
        String::from("-zm1-9"),
        target.to_owned(),
    ];

    tokio::spawn(async move { Command::new("optipng").args(&args).output() })
        .await
        .unwrap()
}
