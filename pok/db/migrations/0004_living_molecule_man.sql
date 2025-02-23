ALTER TABLE "player" DROP CONSTRAINT "player_game_id_game_id_fk";
--> statement-breakpoint
ALTER TABLE "pot" DROP CONSTRAINT "pot_game_id_game_id_fk";
--> statement-breakpoint
ALTER TABLE "participant" DROP CONSTRAINT "participant_pot_id_pot_id_fk";
--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pot" ADD CONSTRAINT "pot_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_pot_id_pot_id_fk" FOREIGN KEY ("pot_id") REFERENCES "public"."pot"("id") ON DELETE cascade ON UPDATE no action;