import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getCategories({ userId }: { userId: User["id"] }) {
  

  const categories = prisma.$queryRaw`SELECT 
    category.name as category,
    SUM(transaction.outflow) as outflow,
    SUM(transaction.inflow) as inflow
    FROM "Category" as category 
    LEFT JOIN "Transaction" as transaction on transaction.category = category.name
    WHERE transaction."userId" = ${userId} 
    GROUP BY category.name
    ORDER BY outflow desc
  `
  
  return categories
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
