/*
  Warnings:

  - The primary key for the `Curso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Curso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CursoAfetado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CursoAfetado` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Disciplina` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Disciplina` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Perfil` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Perfil` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Prova` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Prova` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `token` on the `Session` table. All the data in the column will be lost.
  - The `sessionId` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[cursoId]` on the table `CursoAfetado` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[disciplinaId]` on the table `CursoAfetado` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioCriadorId]` on the table `Disciplina` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[disciplinaId]` on the table `Prova` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `cursoId` on the `CursoAfetado` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `disciplinaId` on the `CursoAfetado` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `usuarioCriadorId` on the `Disciplina` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `disciplinaId` on the `Prova` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `usuarioId` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `perfilId` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CursoAfetado" DROP CONSTRAINT "CursoAfetado_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "CursoAfetado" DROP CONSTRAINT "CursoAfetado_disciplinaId_fkey";

-- DropForeignKey
ALTER TABLE "Disciplina" DROP CONSTRAINT "Disciplina_usuarioCriadorId_fkey";

-- DropForeignKey
ALTER TABLE "Prova" DROP CONSTRAINT "Prova_disciplinaId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_perfilId_fkey";

-- DropIndex
DROP INDEX "Session_token_key";

-- AlterTable
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Curso_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CursoAfetado" DROP CONSTRAINT "CursoAfetado_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "cursoId",
ADD COLUMN     "cursoId" UUID NOT NULL,
DROP COLUMN "disciplinaId",
ADD COLUMN     "disciplinaId" UUID NOT NULL,
ADD CONSTRAINT "CursoAfetado_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Disciplina" DROP CONSTRAINT "Disciplina_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "usuarioCriadorId",
ADD COLUMN     "usuarioCriadorId" UUID NOT NULL,
ADD CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Perfil" DROP CONSTRAINT "Perfil_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Prova" DROP CONSTRAINT "Prova_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "disciplinaId",
ADD COLUMN     "disciplinaId" UUID NOT NULL,
ADD CONSTRAINT "Prova_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "token",
DROP COLUMN "sessionId",
ADD COLUMN     "sessionId" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "usuarioId",
ADD COLUMN     "usuarioId" UUID NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId");

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "perfilId",
ADD COLUMN     "perfilId" UUID NOT NULL,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "CursoAfetado_cursoId_key" ON "CursoAfetado"("cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "CursoAfetado_disciplinaId_key" ON "CursoAfetado"("disciplinaId");

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_usuarioCriadorId_key" ON "Disciplina"("usuarioCriadorId");

-- CreateIndex
CREATE UNIQUE INDEX "Prova_disciplinaId_key" ON "Prova"("disciplinaId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_usuarioId_key" ON "Session"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_perfilId_key" ON "Usuario"("perfilId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_usuarioCriadorId_fkey" FOREIGN KEY ("usuarioCriadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prova" ADD CONSTRAINT "Prova_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoAfetado" ADD CONSTRAINT "CursoAfetado_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoAfetado" ADD CONSTRAINT "CursoAfetado_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
