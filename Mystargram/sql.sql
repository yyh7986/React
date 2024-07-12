DROP TABLE IF EXISTS post;

DROP TABLE IF EXISTS images;

DROP TABLE IF EXISTS member;

DROP TABLE IF EXISTS hashtag;

DROP TABLE IF EXISTS post_hash;

DROP TABLE IF EXISTS follow;

DROP TABLE IF EXISTS reply;
DROP TABLE IF EXISTS likes;

CREATE TABLE `mystargram`.`post` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) NOT NULL,
    `content` VARCHAR(1000) NOT NULL,
    `writer` VARCHAR(45) NOT NULL,
    `writedate` DATETIME NOT NULL DEFAULT now(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `mystargram`.`images` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `postid` INT NOT NULL,
    `filename` VARCHAR(256) NOT NULL,
    `savefilename` VARCHAR(256) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `mystargram`.`member` (
    `nickname` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `pwd` VARCHAR(200) NULL,
    `provider` VARCHAR(45) NULL,
    `snsid` VARCHAR(45) NULL,
    `phone` VARCHAR(45) NULL,
    `profileimg` VARCHAR(256) NULL,
    `indate` DATETIME NOT NULL DEFAULT now(),
    `profilemsg` VARCHAR(300) NULL,
    PRIMARY KEY (`nickname`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `mystargram`.`hashtag` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `mystargram`.`post_hash` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `postid` INT NOT NULL,
    `hashid` INT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `mystargram`.`follow` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `ffrom` VARCHAR(45) NOT NULL,
    `fto` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `mystargram`.`reply` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `postid` INT NOT NULL,
    `writer` VARCHAR(45) NOT NULL,
    `content` VARCHAR(200) NOT NULL,
    `writedate` DATETIME NOT NULL DEFAULT now(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postid` int NOT NULL,
  `likenick` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `f4_idx` (`likenick`),
  KEY `f5_idx` (`postid`),
  CONSTRAINT `f4` FOREIGN KEY (`likenick`) REFERENCES `member` (`nickname`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `f5` FOREIGN KEY (`postid`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


ALTER TABLE `mystargram`.`follow`
ADD INDEX `f2_idx` (`fto` ASC) VISIBLE;

;

ALTER TABLE `mystargram`.`follow`
ADD CONSTRAINT `f1` FOREIGN KEY (`ffrom`) REFERENCES `mystargram`.`member` (`nickname`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `f2` FOREIGN KEY (`fto`) REFERENCES `mystargram`.`member` (`nickname`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `mystargram`.`images`
ADD INDEX `f3_idx` (`postid` ASC) VISIBLE;

;

ALTER TABLE `mystargram`.`images`
ADD CONSTRAINT `f3` FOREIGN KEY (`postid`) REFERENCES `mystargram`.`post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `mystargram`.`likes`
ADD INDEX `f4_idx` (`likenick` ASC) VISIBLE,
ADD INDEX `f5_idx` (`postid` ASC) VISIBLE;

;

ALTER TABLE `mystargram`.`likes`
ADD CONSTRAINT `f4` FOREIGN KEY (`likenick`) REFERENCES `mystargram`.`member` (`nickname`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `f5` FOREIGN KEY (`postid`) REFERENCES `mystargram`.`post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `mystargram`.`post_hash`
ADD INDEX `f6_idx` (`postid` ASC) VISIBLE,
ADD INDEX `f7_idx` (`hashid` ASC) VISIBLE;

;

ALTER TABLE `mystargram`.`post_hash`
ADD CONSTRAINT `f6` FOREIGN KEY (`postid`) REFERENCES `mystargram`.`post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `f7` FOREIGN KEY (`hashid`) REFERENCES `mystargram`.`hashtag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `mystargram`.`reply`
ADD INDEX `f9_idx` (`writer` ASC) VISIBLE,
ADD INDEX `f8_idx` (`postid` ASC) VISIBLE;

;

ALTER TABLE `mystargram`.`reply`
ADD CONSTRAINT `f8` FOREIGN KEY (`postid`) REFERENCES `mystargram`.`post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `f9` FOREIGN KEY (`writer`) REFERENCES `mystargram`.`member` (`nickname`) ON DELETE CASCADE ON UPDATE CASCADE;