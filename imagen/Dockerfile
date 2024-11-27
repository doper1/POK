FROM clux/muslrust:stable AS builder

WORKDIR /app

ARG target=x86_64
RUN --mount=type=secret,id=target,env=target

RUN rustup target add ${target}-unknown-linux-musl && \
    cargo install cargo-chef

COPY . .

RUN cargo chef prepare --recipe-path recipe.json && \
    cargo chef cook --release --target ${target}-unknown-linux-musl --recipe-path recipe.json

RUN cargo build --release --target ${target}-unknown-linux-musl --bin imagen 


FROM alpine:3.19 AS runtime

ARG target=x86_64
RUN --mount=type=secret,id=target,env=target

COPY cards cards

RUN addgroup -S pok && \
    adduser -D -h /app -G pok pok && \
    mkdir ./newCards && \
    chmod -R 777 ./newCards && \
    apk update && apk upgrade && apk add --no-cache \
    imagemagick \
    optipng 

COPY --from=builder /app/target/${target}-unknown-linux-musl/release/imagen /app/imagen

USER pok 

ENTRYPOINT ["/app/imagen"]