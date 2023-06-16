/*
  Warnings:

  - You are about to drop the column `usuarioCriadorId` on the `Prova` table. All the data in the column will be lost.
  - You are about to drop the `UsuarioDisciplina` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `usuarioCriadorId` to the `Disciplina` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Prova" DROP CONSTRAINT "Prova_usuarioCriadorId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioDisciplina" DROP CONSTRAINT "UsuarioDisciplina_disciplinaId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioDisciplina" DROP CONSTRAINT "UsuarioDisciplina_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Disciplina" ADD COLUMN     "usuarioCriadorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Prova" DROP COLUMN "usuarioCriadorId";

-- DropTable
DROP TABLE "UsuarioDisciplina";

-- CreateTable
CREATE TABLE "Session" (
    "sessionId" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_usuarioCriadorId_fkey" FOREIGN KEY ("usuarioCriadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
