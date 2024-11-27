use super::image;
use actix_web::{get, web, HttpResponse, Responder};
use futures::future;
use serde::Deserialize;
use std::sync::Arc;
use tokio_postgres::Client;
use tracing::info;

pub struct State {
    pub client: Arc<Client>,
}

#[derive(Debug, Deserialize)]
struct JoinRequest {
    game_id: String,
    card_index: usize,
}

#[get("/join")]
pub async fn join(req: web::Query<JoinRequest>, state: web::Data<State>) -> impl Responder {
    info!(
        "GET - /join: game_id={}, card_index={}",
        req.game_id, req.card_index
    );

    image::process(req.game_id.to_string(), req.card_index, 2, &state.client)
        .await
        .unwrap();

    HttpResponse::Ok()
}

#[derive(Debug, Deserialize)]
struct StartRequest {
    game_id: String,
}

#[get("/start")]
pub async fn start(req: web::Query<StartRequest>, state: web::Data<State>) -> impl Responder {
    info!("GET - /start: game_id={}", req.game_id);
    let amounts: [usize; 3] = [3, 4, 5];
    let mut tasks = Vec::new();

    for round in 0..=2 {
        let game_id = req.game_id.clone();
        let client = Arc::clone(&state.client);

        tasks.push(tokio::spawn(async move {
            let cards_amount = amounts[round];

            image::process(game_id.to_string(), 0, cards_amount, &client)
                .await
                .unwrap();
        }));
    }

    future::join_all(tasks).await;
    HttpResponse::Ok()
}

#[get("/health")]
pub async fn health_check() -> impl Responder {
    info!("GET /health");
    HttpResponse::Ok().body("Health check successful")
}
