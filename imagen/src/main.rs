use dotenv::dotenv;
use futures::future;
use postgres_array::Array;
use std::sync::Arc;
use std::{future::poll_fn, time::Duration};
use tokio_postgres::{AsyncMessage::Notification, Client, Error};
use tracing::info;

mod db;
mod image;

async fn process(
    game_id: String,
    first_card_index: usize,
    cards_amount: usize,
    query_client: &Client,
) -> Result<(Vec<String>, String), Box<dyn std::error::Error>> {
    let bin = if cfg!(windows) { "magick" } else { "convert" };

    let row = &query_client
        .query_one(
            &format!("SELECT {} FROM game WHERE id=$1", &"deck"),
            &[&game_id],
        )
        .await?;

    let cards_raw: Array<String> = row.get(&"deck");
    let cards_vec: Vec<String> =
        cards_raw.into_inner()[first_card_index..cards_amount * 2 + first_card_index].to_vec();

    let mut cards: Vec<String> = vec![];
    let mut target = String::from("");

    for card in cards_vec.chunks(2) {
        target.push_str(&format!("{}{}", &card[0], &card[1]));
        cards.push(format!("cards/{}{}.png", card[0], card[1]));
    }

    target = format!("newCards/{}.png", target);
    info!("Processing: {}", &target);

    image::generate_image(&cards, &target, bin)
        .await
        .expect("Failed to generate image");

    image::optimize_image(&target)
        .await
        .expect("Failed to optimize image");

    Ok((cards, target))
}

async fn route(
    query_client: Arc<Client>,
    event: &str,
    game_id: &str,
    card_index: usize,
) -> Result<(), Box<dyn std::error::Error>> {
    match event {
        "join" => {
            process(game_id.to_string(), card_index, 2, &query_client)
                .await
                .unwrap();
        }
        "mid-join" => {
            process(game_id.to_string(), card_index, 2, &query_client)
                .await
                .unwrap();
        }
        "start" | "new-hand" => {
            let amounts: [usize; 3] = [3, 4, 5];
            let mut tasks = vec![];

            for i in 0..3 {
                let query_client = Arc::clone(&query_client);
                let game_id = game_id.to_string();
                let cards_amount = amounts[i];

                tasks.push(tokio::spawn(async move {
                    let _ = process(game_id, card_index, cards_amount, &query_client).await;
                }));
            }

            future::join_all(tasks).await;
        }
        _ => {}
    }
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    let (listener_client, mut listener_connection) = db::connect().await?;
    let (query_client, query_connection) = db::connect().await?;
    let query_client = Arc::new(query_client);

    tokio::spawn(async move {
        if let Err(e) = query_connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    tokio::spawn(async move {
        loop {
            // Act upon received events
            match poll_fn(|cx| listener_connection.poll_message(cx)).await {
                Some(Ok(Notification(notice))) => {
                    let payload: Vec<&str> = notice.payload().split("_").collect(); // Notice format: <event_type>_<game_id>_<first_card_index>

                    let event = payload[0].to_owned();
                    let game_id = payload[1].to_owned();
                    let card_index: usize = payload[2].to_owned().parse().unwrap();
                    let query_client = Arc::clone(&query_client);

                    tokio::spawn(async move {
                        route(query_client, &event, &game_id, card_index)
                            .await
                            .unwrap();
                    });
                }
                Some(Err(err)) => {
                    println!("Error while reading messages: {:?}", err);
                }
                _ => {
                    break;
                }
            }
        }

        Ok::<(), Error>(())
    });

    // Listen to events
    listener_client.execute("LISTEN imagen", &[]).await?;
    info!("Listening to notifications");

    // Block the main thread
    loop {
        tokio::time::sleep(Duration::from_millis(100000)).await;
    }
}
