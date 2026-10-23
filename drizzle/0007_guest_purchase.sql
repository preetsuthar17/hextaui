CREATE TABLE `guest_purchase` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`claim` text,
	`product_id` text NOT NULL,
	`plan` text NOT NULL,
	`customer_id` text NOT NULL,
	`status` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`reported_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `guest_purchase_email_idx` ON `guest_purchase` (`email`);--> statement-breakpoint
ALTER TABLE `purchase` ADD `claim` text;--> statement-breakpoint
ALTER TABLE `purchase` ADD `reported_at` integer;