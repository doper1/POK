FROM clux/muslrust:stable AS builder

WORKDIR /app

COPY . .
RUN rustup target add x86_64-unknown-linux-musl
RUN cargo install cargo-chef
RUN cargo chef prepare --recipe-path recipe.json
RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json
RUN cargo build --release --target x86_64-unknown-linux-musl --bin imagen 


FROM alpine:3.19 AS runtime

COPY cards cards

RUN addgroup -S pok && \
    adduser -D -h /app -G pok pok && \
    mkdir ./newCards && \
    chmod -R 777 ./newCards && \
    apk update && apk upgrade && apk add --no-cache \
    imagemagick \
    optipng 

COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/imagen /app/imagen

USER pok 

ENTRYPOINT ["/app/imagen"]