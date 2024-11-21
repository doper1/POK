FROM rust:1.75-slim-bookworm AS builder

WORKDIR /usr/src/app
RUN cargo new --bin imagen
WORKDIR /usr/src/app/imagen

COPY Cargo.toml Cargo.lock ./
RUN cargo fetch

COPY src ./src
RUN cargo build --release


FROM alpine:3.19 

WORKDIR /app

COPY cards /cards

RUN addgroup imagen && \
    adduser -D -h /app -G imagen imagen 

RUN apk update && apk upgrade && apk add --no-cache \
    imagemagick \
    optipng 

COPY --from=builder /usr/src/app/imagen/target/release/imagen /app/imagen

# CMD ["/app/imagen"]