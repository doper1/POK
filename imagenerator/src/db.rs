use dotenv::dotenv;
use std::env;
use tokio_postgres::{tls::NoTlsStream, Client, Connection, Error, NoTls, Socket};

pub async fn connect() -> Result<(Client, Connection<Socket, NoTlsStream>), Error> {
    dotenv().ok();
    let pg_host = env::var("POSTGRES_HOST").expect("POSTGRES_HOST environment variable is missing");
    let pg_user = env::var("POSTGRES_USER").expect("POSTGRES_USER environment variable is missing");
    let pg_password =
        env::var("POSTGRES_PASSWORD").expect("POSTGRES_PASSWORD environment variable is missing");
    let pg_db = env::var("POSTGRES_DB").expect("POSTGRES_DB environment variable is missing");

    let (client, connection): (Client, Connection<Socket, NoTlsStream>) = tokio_postgres::connect(
        &format!(
            "postgres://{}:{}@{}/{}",
            pg_user, pg_password, pg_host, pg_db
        ),
        NoTls,
    )
    .await
    .expect("Failed to connect to the database");

    Ok((client, connection))
}
