-- phím tắt
-- thực thi câu lệnh: 	ctrl + enter (win)	| cmd + enter (mac)
-- reload dữ liệu: 		ctrl + R (win)   	| cmd + R (mac)

-- tạo database
CREATE DATABASE IF NOT EXISTS demo_2;
CREATE DATABASE IF NOT EXISTS cyber_community;


-- xoá database
DROP DATABASE IF EXISTS demo_1;
DROP DATABASE IF EXISTS demo_2;

-- table
CREATE TABLE `User` (
	`id` INT PRIMARY KEY AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`fullName` VARCHAR(255),
	`avatar` TEXT,
	`age` INT,
	`totpSecret` VARCHAR(255),
	`googleId` VARCHAR(255)
)

-- đổi tên TABLE
RENAME TABLE `User` TO `Users`;


-- xoá cột
ALTER TABLE `Users`
DROP COLUMN `age`;

-- thêm cột (sài nhiều)
ALTER TABLE `Users`
ADD COLUMN `password` VARCHAR(255)

-- RÀNG BUỘC 
-- DEFAULT: đặt giá trị mặc định cho một cột nếu không có giá trị
-- NOT NULL UNIQUE: không được null, phải duy nhất
-- PRIMARY KEY: là sự kết hợp của NOT NULL UNIQUE
-- 1 Table chỉ có 1 PRIMARY KEY
-- 1 PRYMARY KEY có thể gom nhiều cột

CREATE TABLE `Foods` (
	`id` INT  AUTO_INCREMENT,
	`name` VARCHAR(255),
	`description` VARCHAR(255) DEFAULT "Chưa có thông tin"
)

ALTER TABLE `Users`
MODIFY `email` VARCHAR(255) NOT NULL UNIQUE

INSERT INTO `Users`(`email`, `fullName`) VALUES
					("A@gmail.com", "nguyen van A"),
					("B@gmail.com", "nguyen van B"),
					("C@gmail.com", "nguyen van C"),
					("D@gmail.com", "nguyen van D"),
					("E@gmail.com", "nguyen van E")
					
INSERT INTO `Foods` (`name`, `description`) VALUES
					("gỏi gà", "được làm từ ga"),
					("gỏi vit", "được làm từ vịt"),
					("gỏi cá", "được làm từ cá"),
					("gỏi heo", "được làm từ heo")
					

-- lệnh hay sài khi xây dựng chức năng, muốn hồi phục lại ban đầu (reset)
SET FOREIGN_KEY_CHECK = 0		
TRUNCATE TABLE `Users`
SET FOREIGN_KEY_CHECK = 1

-- Kiểm tra version
SELECT VERSION()
					
SELECT *
FROM `Users`

SELECT *
FROM `Users`
WHERE `id` = 5

SELECT `id`, `email`, `fullName`, `avatar`
FROM `Users`
WHERE `id` = 5

SELECT `id`, `email`, `fullName`, `avatar` AS "hình ảnh"
FROM `Users`
WHERE `id` = 5

CREATE TABLE `Orders` (
	`id` INT PRIMARY KEY AUTO_INCREMENT,
	
	`userId` INT,
	`foodId` INT,
	
	FOREIGN KEY (`userId`) REFERENCES `Users`(`id`),
	FOREIGN KEY (`foodId`) REFERENCES `Foods`(`id`)
)

-- ONE to ONE: một hàng ở bảng A sẽ chỉ liên kết với một hàng ở bảng B, và ngược lại
-- ONE to MANY: một hàng ở bảng A có thể liên kết với nhiều hàng ở bảng B
-- MANY to MANY: nhiều hàng ở bảng A có thể liên kết với nhiều hàng ở bảng B, ngược lại

-- khi người dùng mua hàng
INSERT INTO `Orders` (`userId`, `foodId`) VALUES 
					(1, 2),
					(3, 1),
					(2, 5),
					(1, 3),
					(3, 2)

-- INNER JOIN: sử dụng khi cần lấy thêm dữ liệu
SELECT *
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
INNER JOIN `Foods` ON `Orders`.`foodId` = `Foods`.`id`

-- LEFT JOIN / RIGHT JOIN: tìm kiếm người chưa hành động
SELECT *
FROM `Orders`
RIGHT JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
WHERE `Orders`.`userId` IS NULL AND `Orders`.`userId` IS NULL

-- CROSS JOIN
SELECT *
FROM `Orders`
CROSS JOIN `Users`


-- GIẢI BÀI TẬP


-- Tìm người đã đặt hàng nhiều nhất.
-- Phân tích: 
	-- Có phát sinh mua hàng thì mới xuất hiện trong bảng orders
	-- GROUP BY: Nhóm những user giống nhau lại rồi đếm hộ xuất hiện bao nhiêu lần
		-- COUNT(), MAX(), MIN(), AVERAGE()
	-- ORDER BY: Sắp xếp giảm dần, người xuất hiện nhiều nhất ở trên cùng
	-- LIMIT 1, lấy người đầu tiên => done
	
-- Bước 1: Lấy tất cả bảng Orders
SELECT *
FROM `Orders`

-- Bước 2: lấy thêm dữ liệu user
SELECT *
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`

-- Bước 3: GROUP BY: thống kê
SELECT *
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `userId`

-- lỗi: Query 1 ERROR at Line 149: : Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'cyber_community.Orders.id' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by

-- Bước 4:
SELECT `userId`, `id`, `email`, `fullName`
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `userId`
-- Lỗi: Query 1 ERROR at Line 157: : Column 'id' in field list is ambiguous

-- Bước 5: chỉ định rõ cột id của bảng User
SELECT `userId`, `Users`.`id`, `email`, `fullName`
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `userId`

-- Bước 6: Thống kê số lượng nhóm được COUNT()
SELECT COUNT(`userId`) AS `Số lần mua hàng`, `Users`.`id`, `email`, `fullName`
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `userId`

-- Bước 7: ORDER BY (ASC: tăng dần / DESC: giảm dần) - Sắp xếp từ lớn tới bé
SELECT COUNT(`userId`) AS `Số lần mua hàng`, `Users`.`id`, `email`, `fullName`
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `userId`
ORDER BY `Số lần mua hàng` DESC

-- Bước 10: lấy người đầu tiên
SELECT COUNT(`userId`) AS `Số lần mua hàng`, `Users`.`id`, `email`, `fullName`
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `userId`
ORDER BY `Số lần mua hàng` DESC
LIMIT 1 -- dùng trong phân trang




-- TEMPLATE TABLE
-- KHÔNG TẠO - Chỉ để làm mẫu

CREATE TABLE IF NOT EXISTS `TABLE_TEMPLATE` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	-- mặc định luôn luôn có
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TIMESTAMP: sô lượng lưu trữ tới 2050

CREATE TABLE IF NOT EXISTS `Articles` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	-- mặc định luôn luôn có
	
	`title` VARCHAR(255),
	`content` TEXT,
	`imageUrl` VARCHAR(255),
	`views` INT NOT NULL DEFAULT 0,
	`userId` INT,
	
	FOREIGN KEY (`userId`) REFERENCES `Users`(`id`),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Users` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	-- mặc định luôn luôn có
	
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`fullName` VARCHAR(255),
	`avatar` TEXT,
	`age` INT,
	`totpSecret` VARCHAR(255),
	`googleId` VARCHAR(255),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Orders` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	-- mặc định luôn luôn có
	
	`userId` INT,
	`foodId` INT,
	
	FOREIGN KEY (`userId`) REFERENCES `Users`(`id`),
	FOREIGN KEY (`foodId`) REFERENCES `Foods`(`id`),	
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Foods` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	-- mặc định luôn luôn có
	`name` VARCHAR(255),
	`description` VARCHAR(255) DEFAULT "Chưa có thông tin",
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO `Users` (`email`, `fullName`) VALUES ("example@gmail.com", "example")


INSERT INTO
	`Articles` (
		`content`,
		`imageUrl`,
		`views`,
		`userId`,
		`createdAt`,
		`updatedAt`
	)
VALUES
	(
		'Content about learning NextJS...',
		'https://picsum.photos/seed/1/600/400',
		15,
		1,
		'2024-01-01 08:00:00',
		'2024-01-01 08:00:00'
	),
	(
		'Content about mastering React Query...',
		'https://picsum.photos/seed/2/600/400',
		32,
		1,
		'2024-01-02 09:00:00',
		'2024-01-02 09:00:00'
	),
	(
		'Content about JavaScript tips...',
		'https://picsum.photos/seed/3/600/400',
		45,
		1,
		'2024-01-03 10:00:00',
		'2024-01-03 10:00:00'
	),
	(
		'Comparison content...',
		'https://picsum.photos/seed/4/600/400',
		27,
		1,
		'2024-01-04 11:00:00',
		'2024-01-04 11:00:00'
	),
	(
		'Content about TypeScript...',
		'https://picsum.photos/seed/5/600/400',
		12,
		1,
		'2024-01-05 12:00:00',
		'2024-01-05 12:00:00'
	),
	(
		'Content about SQL joins...',
		'https://picsum.photos/seed/6/600/400',
		8,
		1,
		'2024-01-06 13:00:00',
		'2024-01-06 13:00:00'
	),
	(
		'Extensions content...',
		'https://picsum.photos/seed/7/600/400',
		60,
		1,
		'2024-01-07 14:00:00',
		'2024-01-07 14:00:00'
	),
	(
		'Content about React optimization...',
		'https://picsum.photos/seed/8/600/400',
		33,
		1,
		'2024-01-08 15:00:00',
		'2024-01-08 15:00:00'
	),
	(
		'Content about API design...',
		'https://picsum.photos/seed/9/600/400',
		18,
		1,
		'2024-01-09 16:00:00',
		'2024-01-09 16:00:00'
	),
	(
		'Predictions about web development...',
		'https://picsum.photos/seed/10/600/400',
		21,
		1,
		'2024-01-10 17:00:00',
		'2024-01-10 17:00:00'
	);





