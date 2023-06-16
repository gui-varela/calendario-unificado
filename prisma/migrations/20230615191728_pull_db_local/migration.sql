/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Perfil` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Disciplina" DROP CONSTRAINT "Disciplina_usuarioCriadorId_fkey";

-- DropIndex
DROP INDEX "Disciplina_usuarioCriadorId_key";

-- DropIndex
DROP INDEX "Prova_disciplinaId_key";

-- CreateTable
CREATE TABLE "Aluno" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuarioId" UUID NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuarioId" UUID NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AlunoToDisciplina" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_usuarioId_key" ON "Aluno"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_usuarioId_key" ON "Professor"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "_AlunoToDisciplina_AB_unique" ON "_AlunoToDisciplina"("A", "B");

-- CreateIndex
CREATE INDEX "_AlunoToDisciplina_B_index" ON "_AlunoToDisciplina"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_codigo_key" ON "Perfil"("codigo");

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_usuarioCriadorId_fkey" FOREIGN KEY ("usuarioCriadorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlunoToDisciplina" ADD CONSTRAINT "_AlunoToDisciplina_A_fkey" FOREIGN KEY ("A") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlunoToDisciplina" ADD CONSTRAINT "_AlunoToDisciplina_B_fkey" FOREIGN KEY ("B") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;
