-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('USA', 'Mexico', 'Canada', 'Brazil', 'Argentina', 'Colombia', 'China', 'Japan', 'Spain', 'Sweden');

-- CreateEnum
CREATE TYPE "StoryTags" AS ENUM ('ScienceFiction', 'Suspense', 'Thriller', 'Adventure', 'Mistery', 'Romance', 'NewAdult', 'NoFiction', 'Fantasy', 'Fiction');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NewChapter', 'NewStory', 'NewPost', 'Comment', 'Reaction', 'Informational');

-- CreateEnum
CREATE TYPE "ActionPerformed" AS ENUM ('Update', 'Delete', 'Insert');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "userUUID" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "birthDay" TIMESTAMPTZ NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "gender" "Gender" NOT NULL,
    "pronouns" TEXT DEFAULT '',
    "region" "Region" NOT NULL,
    "isUserValidated" BOOLEAN NOT NULL DEFAULT false,
    "isWriter" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Story" (
    "storyId" SERIAL NOT NULL,
    "storyUUID" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "synopsis" TEXT NOT NULL DEFAULT '',
    "cover" TEXT NOT NULL DEFAULT '',
    "starred" INTEGER NOT NULL DEFAULT 0,
    "activeReaders" INTEGER NOT NULL DEFAULT 0,
    "rating" SMALLINT NOT NULL DEFAULT 0,
    "writerId" INTEGER NOT NULL,
    "isMature" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("storyId")
);

-- CreateTable
CREATE TABLE "Tags" (
    "tagId" SERIAL NOT NULL,
    "tagName" "StoryTags" NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("tagId")
);

-- CreateTable
CREATE TABLE "Collection" (
    "collectionId" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("collectionId")
);

-- CreateTable
CREATE TABLE "Group" (
    "groupId" SERIAL NOT NULL,
    "groupUUID" UUID NOT NULL,
    "groupName" VARCHAR(300) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "banner" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("groupId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notificationId" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationId")
);

-- CreateTable
CREATE TABLE "Feat" (
    "featId" SERIAL NOT NULL,
    "featName" VARCHAR(100) NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feat_pkey" PRIMARY KEY ("featId")
);

-- CreateTable
CREATE TABLE "Log" (
    "logId" SERIAL NOT NULL,
    "action" "ActionPerformed" NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "sqlTable" VARCHAR(100) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("logId")
);

-- CreateTable
CREATE TABLE "Settings" (
    "settingsId" SERIAL NOT NULL,
    "userSettings" JSONB NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("settingsId")
);

-- CreateTable
CREATE TABLE "StoryHasTags" (
    "storyTagId" INTEGER NOT NULL,
    "storyRelated" INTEGER NOT NULL,

    CONSTRAINT "StoryHasTags_pkey" PRIMARY KEY ("storyTagId","storyRelated")
);

-- CreateTable
CREATE TABLE "CollectionHasStories" (
    "storyId" INTEGER NOT NULL,
    "collectionId" INTEGER NOT NULL,

    CONSTRAINT "CollectionHasStories_pkey" PRIMARY KEY ("storyId","collectionId")
);

-- CreateTable
CREATE TABLE "UserReading" (
    "storyId" INTEGER NOT NULL,
    "readerId" INTEGER NOT NULL,
    "progress" DECIMAL(5,2) NOT NULL,
    "isLoved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserReading_pkey" PRIMARY KEY ("storyId","readerId")
);

-- CreateTable
CREATE TABLE "GroupMembers" (
    "groupId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "memberSince" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GroupMembers_pkey" PRIMARY KEY ("groupId","memberId")
);

-- CreateTable
CREATE TABLE "UserNotification" (
    "notificationId" INTEGER NOT NULL,
    "userNotified" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_USER_NOTIFICATION_NOTIFICATIONS" PRIMARY KEY ("notificationId","userNotified")
);

-- CreateTable
CREATE TABLE "UserFeats" (
    "featId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "progress" DECIMAL(5,2) NOT NULL DEFAULT 0.0,
    "isAchived" BOOLEAN NOT NULL DEFAULT false,
    "achivedAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_USER_FEAT_FEATS" PRIMARY KEY ("featId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_email_firstName_createdAt_idx" ON "User"("username", "email", "firstName", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Story_title_createdAt_idx" ON "Story"("title" ASC, "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Tags_tagName_key" ON "Tags"("tagName");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_icon_key" ON "Tags"("icon");

-- CreateIndex
CREATE INDEX "IDX_COLLECTION_TITLE" ON "Collection"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupUUID_key" ON "Group"("groupUUID");

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupName_key" ON "Group"("groupName");

-- CreateIndex
CREATE INDEX "IDX_GROUP_GROUPNAME" ON "Group"("groupName");

-- CreateIndex
CREATE UNIQUE INDEX "Feat_featName_key" ON "Feat"("featName");

-- CreateIndex
CREATE INDEX "IDX_LOG_ACTION_PERFORMED" ON "Log"("action");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryHasTags" ADD CONSTRAINT "StoryHasTags_storyTagId_fkey" FOREIGN KEY ("storyTagId") REFERENCES "Tags"("tagId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryHasTags" ADD CONSTRAINT "StoryHasTags_storyRelated_fkey" FOREIGN KEY ("storyRelated") REFERENCES "Story"("storyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionHasStories" ADD CONSTRAINT "CollectionHasStories_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("storyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionHasStories" ADD CONSTRAINT "CollectionHasStories_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("collectionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReading" ADD CONSTRAINT "UserReading_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("storyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReading" ADD CONSTRAINT "UserReading_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeats" ADD CONSTRAINT "UserFeats_featId_fkey" FOREIGN KEY ("featId") REFERENCES "Feat"("featId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeats" ADD CONSTRAINT "UserFeats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
