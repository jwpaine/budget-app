import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getCategories({ userId }: { userId: User["id"] }) {
  return prisma.category.findMany({
    where: { userId },
  });
}

export function createCategory({
  name,
  userId,
  maxValue,
  due,
  frequency,
  currentValue,
  spent,
}: {
  name: String;
  userId: User["id"];
  maxValue: Number;
  due: Number;
  frequency: String;
  currentValue: Number;
  spent: Number;
}) {
  return prisma.category.create({
    data: {
      name,
      userId,
      maxValue,
      due,
      frequency,
      currentValue,
      spent,
    },
  });
}

// export function deleteTransaction({
//   id,
//   userId
// } : {id: string, userId: User["id"] }){ return prisma.transaction.deleteMany({
//     where: { id, userId },
//   });
// }

export async function deleteCategory({
  id,
  userId,
}: {
  id: string;
  userId: User["id"];
}) {
  const category = await prisma.category.deleteMany({
    where: { id, userId },
  });
}
