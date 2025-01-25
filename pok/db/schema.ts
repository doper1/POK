const {
  pgTable,
  varchar,
  integer,
  bigint,
  primaryKey,
  uuid,
} = require('drizzle-orm/pg-core');
const { relations, sql } = require('drizzle-orm');
const constants = require('../src/utils/constants');

// TABLE: game
const game = pgTable('game', {
  id: varchar('id', { length: 256 }).primaryKey(),
  groupName: varchar('group_name', { length: 100 }),
  type: varchar('type').default('nlh'),
  status: varchar('status').default('pending'),
  currentPlayer: varchar('current_player', { length: 12 }).references(
    () => user.id,
  ),
  button: varchar('button', { length: 12 }).references(() => user.id),
  deck: varchar('deck', { length: 16 })
    .array()
    .array()
    .default(sql`'{}'::varchar[][]`),
  communityCards: varchar('community_cards', { length: 16 })
    .array()
    .array()
    .default(sql`'{}'::varchar[][]`),
  mainPot: uuid('main_pot').references(() => pot.id),
  lastRoundPot: integer('last_round_pot'),
  lock: bigint('lock', { mode: 'bigint' }),
  smallBlind: integer('small_blind').default(constants.SMALL_BLIND),
  bigBlind: integer('big_blind').default(constants.BIG_BLIND),
});

// TABLE: user
const user = pgTable('user', {
  id: varchar('id', { length: 12 }).primaryKey(),
  money: integer('money').default(constants.BASE_MONEY),
});

// TABLE: player
const player = pgTable(
  'player',
  {
    gameId: varchar('game_id', { length: 256 }).references(() => game.id),
    userId: varchar('user_id', { length: 12 }).references(() => user.id),
    gameMoney: integer('game_money').default(0),
    currentBet: integer('current_bet').default(0),
    status: varchar('status').default('pending'),
    reBuy: integer('re_buy').default(0),
    sessionBalance: integer('session_balance').default(0),
    holeCards: varchar('hole_cards', { length: 16 })
      .array()
      .array()
      .default(sql`'{}'::varchar[][]`),
    nextPlayer: varchar('next_player', { length: 12 }).references(
      () => user.id,
    ),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.gameId, table.userId] }),
    };
  },
);

// TABLE: pot
const pot = pgTable('pot', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: varchar('game_id', { length: 256 }).references(() => game.id),
  value: integer('value'),
  highestBet: integer('highest_bet'),
});

// TABLE: participant
const participant = pgTable(
  'participant',
  {
    potId: uuid('pot_id').references(() => pot.id),
    userId: varchar('user_id', { length: 12 }).references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.potId, table.userId] }),
    };
  },
);

// Relations
const gameRelations = relations(game, ({ one, many }) => ({
  player: many(player),
  pot: many(pot, { relationName: 'gameId' }),
  currentPlayer: one(user, {
    fields: [game.currentPlayer],
    references: [user.id],
    relationName: 'currentPlayer',
  }),
  button: one(user, {
    fields: [game.button],
    references: [user.id],
    relationName: 'button',
  }),
  mainPot: one(pot, {
    fields: [game.mainPot],
    references: [pot.id],
    relationName: 'mainPot',
  }),
}));

const userRelations = relations(user, ({ many }) => ({
  player: many(player, { relationName: 'userId' }),
  participant: many(participant),
  currentPlayer: many(game, { relationName: 'currentPlayer' }),
  button: many(game, { relationName: 'button' }),
  nextPlayer: many(player, { relationName: 'nextPlayer' }),
}));

const playerRelations = relations(player, ({ one }) => ({
  game: one(game, {
    fields: [player.gameId],
    references: [game.id],
  }),
  user: one(user, {
    fields: [player.userId],
    references: [user.id],
    relationName: 'userId',
  }),
  nextPlayer: one(user, {
    fields: [player.nextPlayer],
    references: [user.id],
    relationName: 'nextPlayer',
  }),
}));

const potRelations = relations(pot, ({ one, many }) => ({
  participant: many(participant),
  gameId: one(game, {
    fields: [pot.gameId],
    references: [game.id],
    relationName: 'gameId',
  }),
  // game: one(game, { relationName: 'mainPotId' }),
}));

const participantRelations = relations(participant, ({ one }) => ({
  pot: one(pot, { fields: [participant.potId], references: [pot.id] }),
  user: one(user, {
    fields: [participant.userId],
    references: [user.id],
  }),
}));

module.exports = {
  game,
  user,
  player,
  pot,
  participant,
  gameRelations,
  userRelations,
  playerRelations,
  potRelations,
  participantRelations,
};
