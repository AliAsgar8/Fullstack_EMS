CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`employee_id` int NOT NULL,
	`date` date NOT NULL,
	`check_in` timestamp NOT NULL,
	`check_out` timestamp,
	`working_hours` int NOT NULL DEFAULT 0,
	`day_type` enum('Full Day','Three Quarter Day','Half Day','Short Day','null') NOT NULL DEFAULT 'null',
	`status` enum('present','absent','late') NOT NULL DEFAULT 'present'
);
--> statement-breakpoint
CREATE TABLE `leaves` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`employee_id` int NOT NULL,
	`type` enum('SICK','CASUAL','ANNUAL') NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`reason` varchar(500) NOT NULL,
	`status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING'
);
--> statement-breakpoint
CREATE TABLE `payslips` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`employee_id` int NOT NULL,
	`month` int NOT NULL,
	`year` int NOT NULL,
	`basic_salary` int NOT NULL DEFAULT 0,
	`allowances` int NOT NULL DEFAULT 0,
	`deductions` int NOT NULL DEFAULT 0,
	`net_salary` int NOT NULL DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE `employees` ADD `user_id` int NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_unique` ON `employees` (`user_id`);--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_employee_id_employees_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`);--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_user_id_users_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);--> statement-breakpoint
ALTER TABLE `leaves` ADD CONSTRAINT `leaves_employee_id_employees_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`);--> statement-breakpoint
ALTER TABLE `payslips` ADD CONSTRAINT `payslips_employee_id_employees_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`);