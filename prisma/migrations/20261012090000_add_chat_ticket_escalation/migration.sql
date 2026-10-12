-- AlterEnum
ALTER TYPE "ConversationAuthor" ADD VALUE 'ADMIN';
ALTER TYPE "ConversationAuthor" ADD VALUE 'SYSTEM';

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "adminEscalatedAt" TIMESTAMP(3),
ADD COLUMN     "adminEscalationNote" TEXT;

-- CreateIndex
CREATE INDEX "Conversation_adminEscalatedAt_idx" ON "Conversation"("adminEscalatedAt");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
