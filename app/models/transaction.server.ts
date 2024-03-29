import type { User, Account, Transaction } from "@prisma/client";

import { prisma } from "~/db.server";
export function getTransactions({
  userId,
  accountId,
  startDate
}: {
  userId: User["id"];
  accountId: number,
  startDate: Date
}) {
  if (accountId) {
    return prisma.transaction.findMany({
      where: { accountId, userId },
      orderBy: { date: "desc" },
    });
  }

  if (startDate) {
    return prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate
        }
      },
      orderBy: { date: "desc" },
    });
  }
}

// export function getDailyTransactionSums({
//   userId,
//   startDate
// }: {
//   userId: User["id"];
//   accountId: String,
//   startDate: Date
// }) {

//   if (startDate) {
//     return prisma.transaction.findMany({
//       where: {
//         userId,
//         date: {
//           gte: startDate
//         }
//       },
//       orderBy: { date: "desc" },
//     });
//   }
// }

// export function getDailyTransactionSums({
//   userId,
//   startDate,
//   budgetId
// }: {
//   userId: User["id"];
//   startDate: Date;
//   budgetId: string;
// }) {
//   if (startDate) {
//     return prisma.transaction.groupBy({
//       by: ["date"],
//       where: {
//         userId,
//         account: {
//           budgetId
//         },
//         date: {
//           gte: startDate
//         }
//       },
//       _sum: {
//         inflow: true,
//         outflow: true
//       },
//       orderBy: { date: "desc" },
//     });
//   }
// }

export function getDailyTransactionSums({
  userId,
  startDate,
  budgetId
}: {
  userId: User["id"];
  startDate: Date;
  budgetId: number;
}) {
  if (startDate) {
    return prisma.transaction.groupBy({
      by: ["date"],
      where: {
        userId,
        account: {
          budgetId
        },
        date: {
          gte: startDate
        },
        NOT: { type: "R" } // Exclude transactions with type "R"
      },
      _sum: {
        inflow: true,
        outflow: true
      },
      orderBy: { date: "desc" },
    });
  }
}









export function getUncategorizedTransactions({ userId }: { userId: User["id"] }) {

  // get Uncategorized

  const category = "Uncategorized"

  return prisma.transaction.findMany({
    where: { userId, category }
  });


}


export function createTransaction({
  accountId,
  date,
  payee,
  category,
  memo,
  inflow,
  outflow,
  userId,
  type
}: {
  accountId: number;
  date: Date;
  payee: string;
  category?: number | null;
  memo: string;
  inflow: number;
  outflow: number;
  userId: User["id"];
  type: string;
}) {
  return prisma.transaction.create({
    data: {
      date,
      payee,
      category,
      memo,
      inflow,
      outflow,
      userId,
      type,
      account: {
        connect: {
          id: accountId,
        },
      },
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

export async function deleteTransaction({
  id,
  userId,
}: {
  id: number;
  userId: User["id"];
}) {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });
  if (!transaction) {
    throw new Error(`Transaction with id ${id} not found`);
  }
  const { accountId, inflow, outflow } = transaction;
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });
  if (!account || account.userId !== userId) {
    throw new Error(
      `Account with id ${accountId} not found or does not belong to user with id ${userId}`
    );
  }
  await prisma.transaction.delete({
    where: { id },
  });

  await prisma.account.update({
    where: { id: accountId },
    data: {
      balance: {
        decrement: Number(inflow) > 0 ? Number(inflow) : -Number(outflow),
      },
    },
  });
}

export async function updateTransaction({
  id,
  date,
  payee,
  category,
  memo,
  newInflow,
  newOutflow,
  userId,
}: {
  id: number
  date: Date;
  payee: string;
  category?: number | null;
  memo: string;
  newInflow: number;
  newOutflow: number;
  userId: User["id"];
}) {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });
  if (!transaction) {
    throw new Error(`Transaction with id ${id} not found`);
  }
  const { accountId, inflow, outflow } = transaction;
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });
  if (!account || account.userId !== userId) {
    throw new Error(
      `Account with id ${accountId} not found or does not belong to user with id ${userId}`
    );
  }
  await prisma.transaction.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      date,
      payee,
      category,
      memo,
      inflow: newInflow,
      outflow: newOutflow,
      userId,
    },
  });

  const { balance } = account;

  // if inflow or outflow changed, make adjustments to account balance
  if (Number(inflow) != newInflow || Number(outflow) != newOutflow) {
    const recover = Number(inflow) > 0 ? -Number(inflow) : Number(outflow);
    console.log(`need to recover: ${recover}`);

    const newBalance =
      Number(balance) + recover + Number(newInflow) - Number(newOutflow);

    await prisma.account.updateMany({
      where: { id: accountId, userId },
      data: { balance: newBalance },
    });
  }
}

// let inflowDiff = Math.abs(Number(inflow) - Number(newInflow))
// let outFlowDiff = Math.abs(Number(outflow) - Number(newOutflow))

// let decrement = inflowDiff - outFlowDiff

// console.log(`inflow: ${inflow}, outflow: ${outflow}, newInflow: ${newInflow}, newOutflow: ${newOutflow}, inflowDiff: ${inflowDiff}, outflowDiff: ${outFlowDiff}`)
// console.log(`net change: ${decrement}`)
// return
// // await prisma.account.update({
// //   where: { id: accountId },
// //   data: { balance: { decrement: inflowDiff} }
// // });
