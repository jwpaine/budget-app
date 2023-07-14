import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function updateCategory({
  id,
  userId,
  name,
  currentValue,
  maxValue,
  due
}: {
  id: string;
  name: string,
  currentValue: number,
  maxValue: number,
  userId: User["id"]
  due: Date
}) {

  const updateCategory = await prisma.category.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      userId,
      id,
      name,
      currentValue,
      maxValue,
      due
    },
  });

  if (!updateCategory) {
    return false
  }
  // add category adjustment entry per the following model:

  return prisma.categoryAdjustment.create({
    data: {
      userId,
      categoryId: id,
      value: currentValue,
      window: new Date() // @TODO need to pass window from client
    }
  })

}

export async function setBudget({
  id,
  userId,
  currentValue
}: {
  id: string;
  currentValue: number,
  userId: User["id"]
}) {

  const category = await prisma.category.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      currentValue
    },
  });

  if (!category) {
    return false
  }
  return prisma.categoryAdjustment.create({
    data: {
      userId,
      categoryId: id,
      value: currentValue,
      window: new Date()  // @TODO need to pass window from client
    }
  })

}

export async function getCategoryNames({ userId }: { userId: User["id"] }) {
  // first obtain activeBudget from user:
  const account = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      activeBudget: true,
    },
  });
  if (!account || !account.activeBudget) {
    return false
  }

  const budgetId = account.activeBudget as string
  return prisma.category.findMany({
    where: { userId, budgetId },
    select: { name: true, id: true }
  });
}

export function getCategories({ userId, budgetId, startDate }: { userId: User["id"], budgetId: string, startDate: string }) {

  console.log("getting categories for budgetId: ", budgetId, " and userId: ", userId, " and startDate: ", startDate)

  const categories = prisma.$queryRaw`
  SELECT 
    category.name as category,
    category.id as id,
    category."currentValue" as "currentValue",
    category.due as due,
    category."maxValue" as needed,
    COALESCE(SUM(transaction.outflow), 0) as outflow,
    COALESCE(SUM(transaction.inflow), 0) as inflow,
    adjustment.value as adjustment
  FROM "Category" as category 
  LEFT OUTER JOIN "Transaction" as transaction on transaction.category = category.id
  LEFT OUTER JOIN (
    SELECT DISTINCT ON ("categoryId") "categoryId", value
    FROM "CategoryAdjustment"
    ORDER BY "categoryId", "createdAt" DESC
  ) as adjustment on adjustment."categoryId" = category.id
  WHERE category."userId" = ${userId}
    AND category."budgetId" = ${budgetId}
  GROUP BY category.id, adjustment.value
  ORDER BY due ASC
`;


  //   SELECT 
  //   category.name as category,
  //   category.id as id,
  //   category."currentValue" as "currentValue",
  //   category.due as due,
  //   category."maxValue" as needed,
  //   COALESCE(SUM(transaction.outflow), 0) as outflow,
  //   COALESCE(SUM(transaction.inflow), 0) as inflow
  // FROM "Category" as category 
  // LEFT OUTER JOIN (
  //   SELECT * FROM "Transaction" 
  //   WHERE date >= '2023-06-01' AND date <= '2025-06-30'
  // ) as transaction on transaction.category = category.id
  // WHERE category."userId" = ${userId} 
  // GROUP BY category.id
  // ORDER BY due asc


  return categories
}

export async function initUserCategories({ userId, budgetId }: { userId: User["id"], budgetId: string }) {

  const categories = [
    {
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🏠 Mortgage',
      currentValue: 0,
      maxValue: 1200,
      budgetId: budgetId

    },
    {
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '📱 Phone',
      currentValue: 0,
      maxValue: 120,
      budgetId: budgetId
    },


    {
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🎥 Netflix',
      currentValue: 0,
      maxValue: 16.61,
      budgetId: budgetId

    },
    {
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 14).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🚗 Car Insurance',
      currentValue: 0,
      maxValue: 90,
      budgetId: budgetId

    },
    {
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🏋Gym',
      currentValue: 0,
      maxValue: 45,
      budgetId: budgetId

    },
    {
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🥕 Grocery',
      currentValue: 0,
      maxValue: 500,
      budgetId: budgetId

    },

    {
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 9).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🔌 Electric',
      currentValue: 0,
      maxValue: 150,
      budgetId: budgetId

    },

    {
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🍺 Fun',
      currentValue: 0,
      maxValue: 50,
      budgetId: budgetId

    }
  ];

  // '{ userId: string; spent: number; due: string; frequency: string; name: string; currentValue: number; maxValue: number; }[]' 
  // is not assignable to parameter of type 
  // '{ name: string; userId: string; maxValue: number; frequency: string; currentValue: number; spent: number; due: Date; }[]'


  return await createCategories(categories)
  // .then((createdCategories) => {
  //   console.log('Created categories:', createdCategories);
  // })
  // .catch((error) => {
  //   console.error('Error creating categories:', error);
  // });
}


export async function createCategories(categories: {
  name: string,
  userId: User["id"],
  maxValue: number,
  frequency: string,
  currentValue: number,
  spent: number,
  due: Date,
  budgetId: string
}[]) {
  return prisma.category.createMany({
    data: categories,
  });
}


export async function createCategory({
  name,
  userId,
  maxValue,
  frequency,
  currentValue,
  spent,
  due
}: {
  name: String;
  userId: User["id"];
  maxValue: Number;
  frequency: String;
  currentValue: Number;
  spent: Number;
  due: Date
}) {
  // first obtain activeBudget from user:
  const account = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      activeBudget: true,
    },
  });

  // if activeBudget is NOT null, then we can create a category
  if (!account || !account.activeBudget) {
    return false;
  }

  const budgetId = account.activeBudget;

  console.log("Adding category for active budget: ", budgetId);


  return prisma.category.create({
    data: {
      name,
      userId,
      maxValue,
      frequency,
      currentValue,
      spent,
      budgetId,
      due
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
