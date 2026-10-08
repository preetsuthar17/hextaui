CREATE TABLE `email_send` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign` text NOT NULL,
	`user_id` text NOT NULL,
	`sent_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_send_campaign_user_idx` ON `email_send` (`campaign`,`user_id`);--> statement-breakpoint
ALTER TABLE `user` ADD `unsubscribed_at` integer;