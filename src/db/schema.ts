const {
  pgTable,
  varchar,
  integer,
  primaryKey,
  uuid,
} = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');
const constants = require('../constants');

// TABLE: game
const game = pgTable('game', {
  id: varchar('id', { length: 18 }).primaryKey(),
  type: varchar('type').default('nlh'),
  status: varchar('status').default('pending'),
  currentPlayer: varchar('current_player', { length: 12 }).references(
    () => player.id,
  ),
  button: varchar('button', { length: 12 }).references(() => player.id),
  deck: varchar('deck', { length: 1 }).array().array(),
  communityCards: varchar('deck', { length: 1 }).array().array(),
  lastRoundPot: integer('last_round_pot'),
});

// TABLE: player
const player = pgTable('player', {
  id: varchar('id', { length: 12 }).primaryKey(),
  money: integer('money').default(constants.BASE_MONEY),
});

// TABLE: game_player
const gamePlayer = pgTable(
  'game_player',
  {
    gameId: varchar('game_id', { length: 18 }).references(() => game.id),
    playerId: varchar('player_id', { length: 12 }).references(() => player.id),
    gameMoney: integer('game_money').default(0),
    currentBet: integer('current_bet'),
    status: varchar('status').default('pending'),
    reBuy: integer('re_buy').default(0),
    sessionBalance: integer('session_balance').default(0),
    holeCards: varchar('hole_cards', { length: 1 }).array().array(),
    nextPlayer: varchar('next_player', { length: 12 }).references(
      () => player.id,
    ),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.gameId, table.playerId] }),
    };
  },
);

// TABLE: pot
const pot = pgTable('pot', {
  id: uuid('id').primaryKey(),
  gameId: varchar('game_id', { length: 18 }).references(() => game.id),
  value: integer('value'),
  highestBet: integer('highest_bet'),
});

// TABLE: pot_player
const potPlayer = pgTable(
  'pot_player',
  {
    potId: uuid('pot_id').references(() => pot.id),
    playerId: varchar('player_id', { length: 12 }).references(() => player.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.potId, table.playerId] }),
    };
  },
);

// Relations
const gameRelations = relations(game, ({ one, many }) => ({
  gamePlayer: many(gamePlayer),
  pot: many(pot),
  currentPlayer: one(player, {
    fields: [game.currentPlayer],
    references: [player.id],
  }),
  button: one(player, { fields: [game.button], references: [player.id] }),
}));

const playerRelations = relations(player, ({ many }) => ({
  gamePlayer: many(gamePlayer),
  potPlayer: many(potPlayer),
  currentPlayer: many(game),
  button: many(game),
}));

const gamePlayerRelations = relations(gamePlayer, ({ one }) => ({
  game: one(game, { fields: [gamePlayer.gameId], references: [game.id] }),
  player: one(player, {
    fields: [gamePlayer.playerId],
    references: [player.id],
  }),
}));

const potRelations = relations(pot, ({ one, many }) => ({
  potPlayer: many(gamePlayer),
  game: one(game, { fields: [pot.gameId], references: [game.id] }),
}));

const potPlayerRelations = relations(potPlayer, ({ one }) => ({
  pot: one(pot, { fields: [potPlayer.potId], references: [pot.id] }),
  player: one(player, {
    fields: [potPlayer.playerId],
    references: [player.id],
  }),
}));

module.exports = {
  game,
  player,
  gamePlayer,
  pot,
  potPlayer,
  gameRelations,
  playerRelations,
  gamePlayerRelations,
  potRelations,
  potPlayerRelations,
};
