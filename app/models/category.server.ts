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
      maxValue,
      due
    },
  });

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
  
  await prisma.category.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      currentValue
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
    category."maxValue" as needed,
    SUM(transaction.outflow) as outflow,
    SUM(transaction.inflow) as inflow
    FROM "Category" as category 
    LEFT JOIN "Transaction" as transaction on transaction.category = category.id
    WHERE category."userId" = ${userId} 
    GROUP BY category.id
    ORDER BY due asc
  `
  
  return categories
}

export async function initUserCategories({userId} : {userId : User["id"]}) {

  const categories = [
    { 
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🏠 Mortgage',
      currentValue: 0,
      maxValue: 1200,
      
    },
    { 
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '📱 Phone',
      currentValue: 0,
      maxValue: 120,
    },
      
   
    { 
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🎥 Netflix',
      currentValue: 0,
      maxValue: 16.61,
      
    },
    { 
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 14).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🚗 Car Insurance',
      currentValue: 0,
      maxValue: 90,
      
    },
    { 
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🏋Gym',
      currentValue: 0,
      maxValue: 45,
      
    },
    { 
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🥕 Grocery',
      currentValue: 0,
      maxValue: 500,
      
    },

    { 
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 9).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🔌 Electric',
      currentValue: 0,
      maxValue: 150,
      
    },

    { 
      userId: userId,
      spent: 0,
      due: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10)) as Date,
      frequency: 'M',
      name: '🍺 Fun',
      currentValue: 0,
      maxValue: 50,
      
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
  due: Date
}[]) {
  return prisma.category.createMany({
    data: categories,
  });
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
