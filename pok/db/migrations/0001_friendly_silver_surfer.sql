ALTER TABLE "game" ALTER COLUMN "id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "player" ALTER COLUMN "game_id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "pot" ALTER COLUMN "game_id" SET DATA TYPE varchar(256);