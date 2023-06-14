import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // const user = await prisma.usuario.create({
  //   data: {
  //     username: 'Bob',
  //     email: 'bob@prisma.io',
  //     password: '1234',
  //     perfil: {
  //       create: {
  //         codigo: 'P',
  //         nome: 'Professor'
  //       }
  //     }
  //   },
  // });

  const perfil = await prisma.perfil.createMany({
    data: [
      {
        codigo: 'P',
        nome: 'Professor'
      },
      {
        codigo: 'A',
        nome: 'Aluno'
      },
    ],
  });

  console.log(perfil);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
