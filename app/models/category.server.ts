import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function updateCategory({
  id,
  userId,
  name,
  currentValue,
  due
}: {
  id: string;
  name: string,
  currentValue: number
  userId: User["id"]
  due: Date
}) {
  
  await prisma.category.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      userId,
      id,
      name,
      currentValue,
      due
    },
  });

}

export function getCategoryNames({ userId }: { userId: User["id"] }) {
  return prisma.category.findMany({
    where: { userId },
    select: {name : true, id : true}
  });
}

export function getCategories({ userId }: { userId: User["id"] }) {

  const categories = prisma.$queryRaw`SELECT 
    category.name as category,
    category.id as id,
    category."currentValue" as "currentValue",
    category.due as due,
    SUM(transaction.outflow) as outflow,
    SUM(transaction.inflow) as inflow
    FROM "Category" as category 
    LEFT JOIN "Transaction" as transaction on transaction.category = category.id
    WHERE category."userId" = ${userId} 
    GROUP BY category.id
    ORDER BY outflow desc
  `
  
  return categories
}




// , select: {name : true}
export function createCategory({
  name,
  userId,
  maxValue,
  frequency,
  currentValue,
  spent,
}: {
  name: String;
  userId: User["id"];
  maxValue: Number;
  frequency: String;
  currentValue: Number;
  spent: Number;
}) {
  return prisma.category.create({
    data: {
      name,
      userId,
      maxValue,
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
