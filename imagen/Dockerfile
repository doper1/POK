FROM rust:alpine3.19 AS builder

RUN apk update && apk upgrade && apk --no-cache add musl-dev

WORKDIR /usr/src/app
COPY Cargo.toml Cargo.lock imagen/
WORKDIR /usr/src/app/imagen

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    cargo fetch

COPY src ./src

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    cargo build --release --target-dir /target


FROM alpine:3.19

WORKDIR /app

COPY cards cards

RUN addgroup pok && \
    adduser -D -h /app -G pok pok 

RUN mkdir -p ./newCards && \
    chown -R pok:pok ./newCards && \
    chmod -R 770 ./newCards

RUN apk update && apk upgrade && apk add --no-cache \
    imagemagick \
    optipng

COPY --from=builder --chown=pok --chmod=700 /target/release/imagen /app/imagen

USER pok 

ENTRYPOINT ["/app/imagen"]
