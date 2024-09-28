CREATE TABLE IF NOT EXISTS "game" (
	"id" varchar(18) PRIMARY KEY NOT NULL,
	"type" varchar DEFAULT 'nlh',
	"status" varchar DEFAULT 'pending',
	"current_player" varchar(12),
	"button" varchar(12),
	"deck" varchar(1)[][],
	"last_round_pot" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"money" integer DEFAULT 1000
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_player" (
	"game_id" varchar(18),
	"player_id" varchar(12),
	"game_money" integer DEFAULT 0,
	"current_bet" integer,
	"status" varchar DEFAULT 'pending',
	"re_buy" integer DEFAULT 0,
	"session_balance" integer DEFAULT 0,
	"hole_cards" varchar(1)[][],
	"next_player" varchar(12),
	CONSTRAINT "game_player_game_id_player_id_pk" PRIMARY KEY("game_id","player_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pot" (
	"id" uuid PRIMARY KEY NOT NULL,
	"game_id" varchar(18),
	"value" integer,
	"highest_bet" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pot_player" (
	"pot_id" uuid,
	"player_id" varchar(12),
	CONSTRAINT "pot_player_pot_id_player_id_pk" PRIMARY KEY("pot_id","player_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game" ADD CONSTRAINT "game_current_player_player_id_fk" FOREIGN KEY ("current_player") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game" ADD CONSTRAINT "game_button_player_id_fk" FOREIGN KEY ("button") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_player" ADD CONSTRAINT "game_player_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_player" ADD CONSTRAINT "game_player_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_player" ADD CONSTRAINT "game_player_next_player_player_id_fk" FOREIGN KEY ("next_player") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pot" ADD CONSTRAINT "pot_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pot_player" ADD CONSTRAINT "pot_player_pot_id_pot_id_fk" FOREIGN KEY ("pot_id") REFERENCES "public"."pot"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pot_player" ADD CONSTRAINT "pot_player_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
