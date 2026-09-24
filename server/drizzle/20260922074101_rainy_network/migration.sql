CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(255) NOT NULL,
	`position` varchar(255) NOT NULL,
	`basic_salary` int DEFAULT 0,
	`allowance` int DEFAULT 0,
	`deductions` int DEFAULT 0,
	`employee_status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`join_date` date NOT NULL,
	`is_deleted` boolean NOT NULL DEFAULT false,
	`bio` varchar(255) DEFAULT '',
	`department` enum('Engineering','Human Resources','Marketing','Sales','Finance','Operations','IT Support','Customer Success','Product Management','Design') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('admin','employee') NOT NULL DEFAULT 'employee',
	`created_at` timestamp NOT NULL DEFAULT (now())
);
