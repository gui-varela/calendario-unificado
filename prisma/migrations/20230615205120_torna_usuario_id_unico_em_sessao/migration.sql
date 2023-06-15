/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session_usuarioId_key" ON "Session"("usuarioId");
