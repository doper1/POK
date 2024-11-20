FROM rust:1.75-slim-bookworm AS builder

RUN apt-get update && apt-get install -y \
        imagemagick \
        optipng \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
RUN cargo new --bin imagen
WORKDIR /usr/src/app/imagen

COPY Cargo.toml Cargo.lock ./
RUN cargo fetch

COPY src ./src
RUN cargo build --release


FROM scratch

COPY cards /cards

COPY --from=builder /lib64/ld-linux-x86-64.so.2 /lib64/ 

COPY --from=builder /usr/bin/convert /usr/bin/
COPY --from=builder /usr/bin/optipng /usr/bin/
COPY --from=builder /usr/src/app/imagen/target/release/imagen /usr/bin/
COPY --from=builder /usr/lib/x86_64-linux-gnu/ /usr/lib/x86_64-linux-gnu/

CMD ["/usr/bin/imagen"]