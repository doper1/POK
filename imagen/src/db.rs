use dotenv::dotenv;
use std::{env, time::Duration};
use tokio::time::sleep;
use tokio_postgres::{tls::NoTlsStream, Client, Connection, NoTls, Socket};
use tracing::{error, info};

async fn try_connect() -> Result<(Client, Connection<Socket, NoTlsStream>), String> {
    dotenv().ok();
    let pg_host = env::var("POSTGRES_HOST").expect("POSTGRES_HOST environment variable is missing");
    let pg_user = env::var("POSTGRES_USER").expect("POSTGRES_USER environment variable is missing");
    let pg_password =
        env::var("POSTGRES_PASSWORD").expect("POSTGRES_PASSWORD environment variable is missing");
    let pg_db = env::var("POSTGRES_DB").expect("POSTGRES_DB environment variable is missing");

    let result = tokio_postgres::connect(
        &format!(
            "postgres://{}:{}@{}/{}",
            pg_user, pg_password, pg_host, pg_db
        ),
        NoTls,
    )
    .await;

    match result {
        Ok((client, connection)) => {
            return Ok((client, connection));
        }
        Err(e) => {
            return Err(format!("{}", e));
        }
    }
}

pub async fn connect() -> Result<(Client, Connection<Socket, NoTlsStream>), String> {
    for try_count in 1..=30 {
        let result: Result<(Client, Connection<Socket, NoTlsStream>), String> = try_connect().await;

        match result {
            Ok((client, connection)) => {
                info!("Successfully connected to the database!");
                return Ok((client, connection));
            }
            Err(err) => error!(
                "Failed to connect to the database (attempt {}): {}",
                try_count, err
            ),
        };

        sleep(Duration::from_secs(1)).await;
    }

    Err("Failed to connect to the database, check if the database is up and if the environment variables are correct".to_string())
}
