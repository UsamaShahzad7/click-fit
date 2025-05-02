-- Note: Tested and exceuted this script in Beekeper with MySQL

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
    `password` VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
    `type` VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
    `active` TINYINT DEFAULT 1,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `unique_email` (`email`)
);

DROP PROCEDURE IF EXISTS `addUser`;

CREATE PROCEDURE `addUser`(
    IN user_email VARCHAR(255),
    IN user_password VARCHAR(255),
    IN user_type VARCHAR(255)
)
BEGIN
    INSERT INTO `users` (`email`, `password`, `type`, `active`)
    VALUES (user_email, user_password, user_type, 1);
END;

CALL `addUser`('test.user@example.com', '1234', 'member');
CALL `addUser`('admin@clickfit.com', '2233', 'admin');

SELECT * FROM `users`;
