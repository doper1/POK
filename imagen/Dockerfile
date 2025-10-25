# Build stage with cargo-chef for optimal caching
FROM clux/muslrust:stable AS chef
WORKDIR /app

# Install cargo-chef
RUN cargo install cargo-chef --locked

# Planner stage - prepare recipe
FROM chef AS planner
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo chef prepare --recipe-path recipe.json

# Builder stage - cook dependencies and build
FROM chef AS builder
ARG TARGET=x86_64

# Add target and install cargo-chef (already installed from chef stage)
RUN rustup target add ${TARGET}-unknown-linux-musl

# Copy recipe from planner stage
COPY --from=planner /app/recipe.json recipe.json

# Cook dependencies - this layer is cached if dependencies don't change
RUN cargo chef cook --release --target ${TARGET}-unknown-linux-musl --recipe-path recipe.json

# Copy source code and build
COPY . .
RUN cargo build --release --target ${TARGET}-unknown-linux-musl --bin imagen

# Runtime stage
FROM alpine:3.19 AS runtime

# Copy cards directory
COPY cards cards

# Set up runtime environment
RUN addgroup -S pok && \
    adduser -D -h /app -G pok pok && \
    mkdir ./newCards && \
    chmod -R 777 ./newCards && \
    apk update && apk upgrade && apk add --no-cache \
    imagemagick \
    optipng

# Copy binary from builder stage
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/imagen /app/imagen

# Switch to non-root user
USER pok

# Set entrypoint
ENTRYPOINT ["/app/imagen"]