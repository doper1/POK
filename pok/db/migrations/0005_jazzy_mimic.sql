ALTER TABLE "game" ALTER COLUMN "current_player" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "button" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "player" ALTER COLUMN "user_id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "player" ALTER COLUMN "next_player" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "participant" ALTER COLUMN "user_id" SET DATA TYPE varchar(256);