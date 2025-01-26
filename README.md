# POK

POK is an open-source WhatsApp bot that brings poker games to group chats, automating card dealing, game rules, and tracking the game state for seamless play.

## Features

- **Play Poker on WhatsApp:** Enjoy poker games directly within your WhatsApp group chat.
- **Automated gameplay:** The bot handles dealing cards, managing bets, and determining winners.
- **Cross-Platform:** Works on any device that supports WhatsApp.
- **Open Source:** Free to use and modify under the Apache license.

## Tech Stack

- [Node](https://nodejs.org/) - v20
- [PostgreSQL](https://www.postgresql.org/) - v16.4
- [Drizzle ORM](https://orm.drizzle.team/) for DB integration. Also provides [Drizzle studio](https://orm.drizzle.team/drizzle-studio/overview)
- [Rust](https://www.rust-lang.org/) for the image generation service
- [Docker](https://www.docker.com/) for deployment

## Installation

### Prerequisites

If using docker:

- [Docker](https://www.docker.com/) desktop or Docker

If not using docker:

- [Node.js](https://nodejs.org/) and npm (Node Package Manager) installed on your system.
- [PostgreSQL](https://www.postgresql.org/) database up and running
- A valid WhatsApp account

For development:

Create inside /pok and /imagen folder called 'newImages'

Download:

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

## Usage

1. **Setup the Bot:** Once the bot is running, a QR code will appear on the terminal. Scan the QR code with your whatsapp app this will enable the bot to communicate through you whatsapp account

2. **Start a Game:** At least 2 players need to join the game using `join`. They then need to buy chips using `buy` or just `join [chip amount]` right away

_IMPORTANT_ - Each players get $1000 (in-game) when they first join. The ONLY way to earn more is buy playing. If you lost all of your 1000 - you cannot play anymore. The initial $1000 are consists between whatsapp group and are not individual to each group.

Currently, blinds are 1/2 and there is no way to change it. I suggest to buy in between $50 to $150 for each game, until there will be a mechanism to increase blinds

The bot can understand natural language, but at the end every message is translated into one of the following commands (or marked as 'not related'):

### Pre-Game Commands

- `help` - Display help information.
- `join` - Join the game.
- `show` - Show the list of players who have joined.
- `exit` - Exit the game.
- `start` - Start the poker game.
- `small blind` - set small blind
- `big blind` - set big blind

### In-Game Commands

- `check` - Check (pass the action to the next player).
- `call` - Call (match the current highest bet).
- `raise [amount]` - Raise the bet by a specified amount.
- `all in` - Raise all in
- `fold` - Fold your hand.
- `buy [amount]` - buy more chips with your money
- `help` - Display help information.
- `join [amount]` - Join the game (if not already joined). You can also buy while joining
- `show` - Show the list of players in the game.
- `exit` - Exit the game.
- `end` - End the current poker game.
- `small blind` - set small blind
- `big blind` - set big blind

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

Please ensure your commits are clear and are by the [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) standard. Also make sure to write tests using jest and put them in the closet `__tests__` directory.

## License

This project is licensed under the Apache License.

## Contact

For issues, questions, or feedback, feel free to open an issue on GitHub
