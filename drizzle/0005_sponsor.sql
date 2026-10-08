CREATE TABLE `sponsor` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`name` text NOT NULL,
	`headline` text NOT NULL,
	`description` text NOT NULL,
	`cta` text NOT NULL,
	`url` text NOT NULL,
	`email` text NOT NULL,
	`subscription_id` text,
	`customer_id` text,
	`activated_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sponsor_subscription_id_unique` ON `sponsor` (`subscription_id`);--> statement-breakpoint
CREATE INDEX `sponsor_status_idx` ON `sponsor` (`status`);