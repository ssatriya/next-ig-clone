ALTER TABLE "followers" ADD COLUMN "followingsId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followers" ADD CONSTRAINT "followers_followingsId_users_id_fk" FOREIGN KEY ("followingsId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
