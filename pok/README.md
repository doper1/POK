# Pok

Pok is the main API that receive requests from whatsapp and process them

## Tech Stack

- [Node](https://nodejs.org/) - v20
- [PostgreSQL](https://www.postgresql.org/) - v16.4
- [Drizzle ORM](https://orm.drizzle.team/) for DB integration. Also provides [Drizzle studio](https://orm.drizzle.team/drizzle-studio/overview)

## Architecture

![Visualization of the codebase](../docs/diagrams/diagram_pok.svg)

## Installation

### Prerequisites

If using docker:

- [Docker](https://www.docker.com/) desktop or Docker

If not using docker:

- [Node.js](https://nodejs.org/) and npm (Node Package Manager) installed on your system.
- [PostgreSQL](https://www.postgresql.org/) database up and running
- A valid WhatsApp account

For development:

- [Rust](https://www.rust-lang.org/) for the imagen container
- [ImageMagick](https://imagemagick.org/) for the imagen container
- [Optipng](https://optipng.sourceforge.net/) for the imagen container

### Clone the Repository

```bash
git clone https://github.com/doper1/POK.git
cd POK
```

### Install Dependencies (if not using docker)

```bash
npm install
```

### Run the Bot

- Using docker

```bash
docker compose up --build
```

- Without docker

```bash
npm start
```

# Usage

1. **Setup the Bot:** Once the bot is running, a QR code will appear on the terminal. Scan the QR code with your whatsapp app this will enable the bot to communicate through you whatsapp account

2. **Start a Game:** At least 2 players need to join the game using `pok join`. They then need to buy chips using `pok buy` or just `pok join [chip amount]` right away

_IMPORTANT_ - Each players get $1000 (in-game) when they first join. The ONLY way to earn more is buy playing. If you lost all of your 1000 - you cannot play anymore. The initial $1000 are consists between whatsapp group and are not individual to each group.

Currently, blinds are 1/2 and there is no way to change it. I suggest to buy in between $50 to $150 for each game, until there will be a mechanism to increase blinds

The bot can understand natural language, but at the end every message is translated into one of the following commands (or marked as 'not related'):

### Pre-Game Commands

- `pok help` - Display help information.
- `pok join` - Join the game.
- `pok show` - Show the list of players who have joined.
- `pok exit` - Exit the game.
- `pok start` - Start the poker game.

### In-Game Commands

- `pok check` - Check (pass the action to the next player).
- `pok call` - Call (match the current highest bet).
- `pok raise [amount]` - Raise the bet by a specified amount.
- `pok all (in)` - Raise all in
- `pok fold` - Fold your hand.
- `pok buy [amount]` - buy more chips with your money
- `pok help` - Display help information.
- `pok join [amount]` - Join the game (if not already joined). You can also buy while joining
- `pok show` - Show the list of players in the game.
- `pok exit` - Exit the game.
- `pok end` - End the current poker game.
