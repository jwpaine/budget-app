import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  // const email = "mdibound@outlook.com";

  // // cleanup the existing database
  // await prisma.user.delete({ where: { email } }).catch(() => {
  //   // no worries if it doesn't exist yet
  // });

  // const hashedPassword = await bcrypt.hash("5uP3r5Ecr3T1!", 10);

  // const user = await prisma.user.create({
  //   data: {
  //     email,
  //     password: {
  //       create: {
  //         hash: hashedPassword,
  //       },
  //     },
  //   },
  // });

  // await prisma.note.create({
  //   data: {
  //     title: "Code with a devcontainer",
  //     body: "Open repo with devcontainer",
  //     userId: user.id,
  //   },
  // });

  // await prisma.note.create({
  //   data: {
  //     title: "Deploy to Azure",
  //     body: "Deploy to Azure using `azd up`",
  //     userId: user.id,
  //   },
  // });

  // const product = await prisma.product.create({
  //   data: {
  //     name: "test",
  //     price: 9.90,
  //     mainImage: "https://th.bing.com/th/id/OIP.NqlF-WdaGY2Dhg_PETdtbQHaHS?w=221&h=218&c=7&r=0&o=5&dpr=1.3&pid=1.7"
  //   }
  // });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
