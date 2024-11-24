use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use imagen::db;
use imagen::routes;
use std::sync::Arc;
use tracing::error;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "info");
    env_logger::init();

    let (client, connection) = db::connect().await.unwrap();
    let client = Arc::new(client);

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            error!("connection error: {}", e);
            std::process::exit(1);
        }
    });

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(routes::State {
                client: Arc::clone(&client),
            }))
            .service(
                web::scope("/api")
                    .service(routes::health_check)
                    .service(routes::join)
                    .service(routes::start),
            )
    })
    .workers(16)
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
