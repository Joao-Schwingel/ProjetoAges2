-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `cpf` CHAR(11) NOT NULL,
    `password` VARCHAR(30) NOT NULL,
    `profilePicture` VARCHAR(191) NULL,
    `userType` ENUM('ADMIN', 'BASIC') NOT NULL DEFAULT 'BASIC',
    `walletId` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_cpf_key`(`cpf`),
    UNIQUE INDEX `User_walletId_key`(`walletId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet` (
    `walletId` INTEGER NOT NULL AUTO_INCREMENT,
    `claps` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `coins` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `walletLimit` INTEGER UNSIGNED NOT NULL DEFAULT 100,
    `coinsMultiplier` DOUBLE NOT NULL DEFAULT 1.0,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Wallet_userId_key`(`userId`),
    PRIMARY KEY (`walletId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feedback` (
    `feedbackID` INTEGER NOT NULL AUTO_INCREMENT,
    `senderId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,
    `value` INTEGER UNSIGNED NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `message` VARCHAR(300) NULL,
    `visibility` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`feedbackID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `transactionId` INTEGER NOT NULL AUTO_INCREMENT,
    `price` INTEGER UNSIGNED NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,

    PRIMARY KEY (`transactionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `itemId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `description` VARCHAR(1000) NOT NULL,
    `price` INTEGER UNSIGNED NOT NULL,
    `image` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `available` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Developers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(127) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Developers_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`itemId`) ON DELETE RESTRICT ON UPDATE CASCADE;
