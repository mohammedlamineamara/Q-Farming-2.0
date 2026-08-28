CREATE TABLE `activities` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`icon` varchar(50) NOT NULL DEFAULT '📋',
	`type` enum('success','warning','danger','info') NOT NULL DEFAULT 'info',
	`read` boolean NOT NULL DEFAULT false,
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_insights` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`icon` varchar(50) NOT NULL DEFAULT '🤖',
	`confidence` int NOT NULL DEFAULT 90,
	`category` varchar(100) NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_insights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `calendar_events` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`eventDate` timestamp NOT NULL,
	`fieldId` bigint unsigned,
	`workerId` bigint unsigned,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `calendar_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fields` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`crop` varchar(100) NOT NULL,
	`size` decimal(10,2) NOT NULL,
	`status` enum('active','irrigation','harvest','fallow') NOT NULL DEFAULT 'active',
	`progress` int NOT NULL DEFAULT 0,
	`location` varchar(255) NOT NULL,
	`lat` varchar(50) NOT NULL,
	`lng` varchar(50) NOT NULL,
	`moisture` int NOT NULL DEFAULT 0,
	`temp` int NOT NULL DEFAULT 0,
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `harvests` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`fieldId` bigint unsigned NOT NULL,
	`crop` varchar(100) NOT NULL,
	`quantity` decimal(12,2) NOT NULL,
	`unit` varchar(20) NOT NULL DEFAULT 'tons',
	`yieldPerHa` decimal(10,2) NOT NULL,
	`harvestedAt` timestamp NOT NULL,
	`notes` text,
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `harvests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory_items` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('seeds','fertilizer','equipment','pesticide','other') NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`max` int NOT NULL DEFAULT 100,
	`unit` varchar(50) NOT NULL,
	`icon` varchar(50) NOT NULL DEFAULT '📦',
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventory_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(50) NOT NULL DEFAULT '🔔',
	`read` boolean NOT NULL DEFAULT false,
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`harvestId` bigint unsigned,
	`crop` varchar(100) NOT NULL,
	`quantity` decimal(12,2) NOT NULL,
	`unit` varchar(20) NOT NULL DEFAULT 'tons',
	`unitPrice` decimal(12,2) NOT NULL,
	`totalAmount` decimal(14,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'DZD',
	`soldAt` timestamp NOT NULL,
	`customer` varchar(255),
	`notes` text,
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sensors` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`value` decimal(10,2) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`max` int NOT NULL DEFAULT 100,
	`status` enum('optimal','warning','critical') NOT NULL DEFAULT 'optimal',
	`color` varchar(50) NOT NULL DEFAULT '#10b981',
	`icon` varchar(50) NOT NULL DEFAULT '📡',
	`fieldId` bigint unsigned,
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sensors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`theme` enum('light','dark') NOT NULL DEFAULT 'dark',
	`offlineMode` boolean NOT NULL DEFAULT true,
	`autoSync` boolean NOT NULL DEFAULT true,
	`gpsTracking` boolean NOT NULL DEFAULT true,
	`aiNotifications` boolean NOT NULL DEFAULT true,
	`predictiveAnalytics` boolean NOT NULL DEFAULT true,
	`farmLocation` varchar(255) NOT NULL DEFAULT 'Algiers, Algeria',
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`unionId` varchar(255) NOT NULL,
	`name` varchar(255),
	`avatar` text,
	`email` varchar(320),
	`password` varchar(255) NOT NULL,
	`role` enum('admin','farm_manager','agronomist','worker') NOT NULL DEFAULT 'worker',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`lastSignInAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_unionId_unique` UNIQUE(`unionId`)
);
--> statement-breakpoint
CREATE TABLE `workers` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL,
	`status` enum('online','offline','busy') NOT NULL DEFAULT 'offline',
	`avatar` varchar(50) NOT NULL DEFAULT '👷',
	`phone` varchar(50),
	`email` varchar(320),
	`userId` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workers_id` PRIMARY KEY(`id`)
);
