ALTER TABLE "comments" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "followers" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "followers" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "id" SET NOT NULL;