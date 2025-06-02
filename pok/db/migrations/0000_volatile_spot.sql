CREATE TABLE "game" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"group_name" varchar(100),
	"type" varchar DEFAULT 'nlh',
	"status" varchar DEFAULT 'pending',
	"current_player" varchar(12),
	"button" varchar(12),
	"deck" varchar(16)[][] DEFAULT '{}'::varchar[][],
	"community_cards" varchar(16)[][] DEFAULT '{}'::varchar[][],
	"main_pot" uuid,
	"last_round_pot" integer,
	"lock" bigint,
	"small_blind" integer DEFAULT 1,
	"big_blind" integer DEFAULT 2
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"money" integer DEFAULT 1000
);
--> statement-breakpoint
CREATE TABLE "player" (
	"game_id" varchar(256),
	"user_id" varchar(12),
	"game_money" integer DEFAULT 0,
	"current_bet" integer DEFAULT 0,
	"status" varchar DEFAULT 'pending',
	"re_buy" integer DEFAULT 0,
	"session_balance" integer DEFAULT 0,
	"hole_cards" varchar(16)[][] DEFAULT '{}'::varchar[][],
	"next_player" varchar(12),
	CONSTRAINT "player_game_id_user_id_pk" PRIMARY KEY("game_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "pot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" varchar(256),
	"value" integer,
	"highest_bet" integer
);
--> statement-breakpoint
CREATE TABLE "participant" (
	"pot_id" uuid,
	"user_id" varchar(12),
	CONSTRAINT "participant_pot_id_user_id_pk" PRIMARY KEY("pot_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_current_player_user_id_fk" FOREIGN KEY ("current_player") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_button_user_id_fk" FOREIGN KEY ("button") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_main_pot_pot_id_fk" FOREIGN KEY ("main_pot") REFERENCES "public"."pot"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_next_player_user_id_fk" FOREIGN KEY ("next_player") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pot" ADD CONSTRAINT "pot_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_pot_id_pot_id_fk" FOREIGN KEY ("pot_id") REFERENCES "public"."pot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;