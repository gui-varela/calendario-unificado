/*
  Warnings:

  - You are about to drop the `CursoAfetado` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nome]` on the table `Curso` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CursoAfetado" DROP CONSTRAINT "CursoAfetado_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "CursoAfetado" DROP CONSTRAINT "CursoAfetado_disciplinaId_fkey";

-- DropTable
DROP TABLE "CursoAfetado";

-- CreateTable
CREATE TABLE "_CursoToDisciplina" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CursoToDisciplina_AB_unique" ON "_CursoToDisciplina"("A", "B");

-- CreateIndex
CREATE INDEX "_CursoToDisciplina_B_index" ON "_CursoToDisciplina"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_nome_key" ON "Curso"("nome");

-- AddForeignKey
ALTER TABLE "_CursoToDisciplina" ADD CONSTRAINT "_CursoToDisciplina_A_fkey" FOREIGN KEY ("A") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToDisciplina" ADD CONSTRAINT "_CursoToDisciplina_B_fkey" FOREIGN KEY ("B") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;
