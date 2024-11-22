FROM rust:alpine3.19 AS builder

RUN apk update && apk upgrade && apk --no-cache add musl-dev

WORKDIR /usr/src/app
RUN cargo new --bin imagen
WORKDIR /usr/src/app/imagen

COPY Cargo.toml Cargo.lock ./
RUN cargo build --release --target-dir /

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

USER imagen

COPY --from=builder --chown=imagen --chmod=700 /usr/src/app/imagen/target/release/imagen /app/imagen

ENTRYPOINT ["/app/imagen"]
