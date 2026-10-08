CREATE TABLE `team_member` (
	`id` text PRIMARY KEY NOT NULL,
	`purchase_id` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`purchase_id`) REFERENCES `purchase`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_member_purchase_email_idx` ON `team_member` (`purchase_id`,`email`);--> statement-breakpoint
CREATE INDEX `team_member_email_idx` ON `team_member` (`email`);--> statement-breakpoint
ALTER TABLE `purchase` ADD `plan` text DEFAULT 'solo' NOT NULL;