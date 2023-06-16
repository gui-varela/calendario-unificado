/*
  Warnings:

  - You are about to drop the column `title` on the `Disciplina` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codigo]` on the table `Disciplina` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `Disciplina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Disciplina` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Disciplina" DROP COLUMN "title",
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_codigo_key" ON "Disciplina"("codigo");
