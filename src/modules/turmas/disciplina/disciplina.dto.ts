import { Curso } from "@prisma/client";

export type DisciplinaDTO = {
  nome: string;
  codigo: string;
  username: string;
  cursos: Array<Curso>;
};
