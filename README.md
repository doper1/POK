# POK

![License](https://img.shields.io/github/license/doper1/POK)
![Issues](https://img.shields.io/github/issues/doper1/POK)

POK is an open-source WhatsApp bot that brings poker games to group chats, automating card dealing, game rules, and tracking the game state for seamless play.

## Features

- **Play Poker on WhatsApp:** Enjoy poker games directly within your WhatsApp group chat.
- **Automated gameplay:** The bot handles dealing cards, managing bets, and determining winners.
- **Cross-Platform:** Works on any device that supports WhatsApp.
- **Open Source:** Free to use and modify under the Apache license.

## Tech Stack

- [Node](https://nodejs.org/) v20
- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://orm.drizzle.team/) for DB integration. Also provides [drizzle studio](https://orm.drizzle.team/drizzle-studio/overview)
- [Docker](https://www.docker.com/) for deployment

## Installation

### Prerequisites

If using docker:

- [Docker](https://www.docker.com/) desktop or Docker

If not using docker:

- [Node.js](https://nodejs.org/) and npm (Node Package Manager) installed on your system.
- https://nodejs.org/ database up and running
- A valid WhatsApp account

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
2. **Start a Game:** At least 2 players need to join the game using `pok join`. They then need to buy chips using `pok buy` or just `pok join [chip amount]` right away

_IMPORTANT_ - Each players get $1000 (in-game) when they first join. The ONLY way to earn more is buy playing. If you lost all of your 1000 - you cannot play anymore. The initial $1000 are consists between whatsapp group and are not individual to each group.

Currently, blinds are 1/2 and there is no way to change it. I suggest to buy in between $50 to $150 for each game, until there will be a mechanism to increase blinds

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

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

Please ensure your commits are clear and are by the [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) standard. Also make sure to write tests using jest and put them in the closet `__tests__` directory.

Because of the DB integration all the tests got invalid so I deleted them all. The can still be found in version 3.1.0 and prior. Their directories still exists

## License

This project is licensed under the Apache License.

## Contact

For issues, questions, or feedback, feel free to open an issue on GitHub
