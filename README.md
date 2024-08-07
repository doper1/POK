# POK

![License](https://img.shields.io/github/license/doper1/POK)
![Issues](https://img.shields.io/github/issues/doper1/POK)

POK is an open-source bot that allows users to play poker directly within a WhatsApp group chat. The bot facilitates poker games, managing the rules, dealing cards, and keeping track of the game state.

## Features

- **Play Poker in WhatsApp:** Enjoy poker games directly within your WhatsApp group chat.
- **Automated Gameplay:** The bot handles dealing cards, managing bets, and determining winners.
- **Multiple Game Modes:** Support for various poker variants.
- **Cross-Platform:** Works on any device that supports WhatsApp.
- **Open Source:** Free to use and modify under the MIT license.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) and npm (Node Package Manager) installed on your system.
- A valid WhatsApp account

### Clone the Repository

```bash
git clone https://github.com/doper1/POK.git
cd POK
```

### Install Dependencies

```bash
npm install
```

### Run the Bot

```bash
npm start
```

## Usage

1. **Setup the Bot:** Once the bot is running, follow the instructions to link it with your WhatsApp account.
2. **Add the Bot to a Group:** Invite the bot to your WhatsApp group chat where you want to play poker.
3. **Start a Game:** Use the command `pok start` to begin a new poker game.

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
- `pok fold` - Fold your hand.
- `pok help` - Display help information.
- `pok join` - Join the game (if not already joined).
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

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For issues, questions, or feedback, feel free to open an issue on GitHub or contact the maintainer at [email@example.com](mailto:email@example.com).

---

This README now accurately reflects the available commands for the bot, both before and during a game. Let me know if there are any further adjustments you'd like!
