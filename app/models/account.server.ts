import type { User, Account } from "@prisma/client";
import { S } from "vitest/dist/types-94cfe4b4";

import { prisma } from "~/db.server";

export async function getAccount({
  id,
  userId,
  linked
}: {
  userId: User["id"],
  id: number,
  linked?: boolean
}) {
  // return prisma.account.findFirst({
  //   select: { id: true, name: true, balance: true, type: true, categoryId: true},
  //   where: { id, userId },
 
  // });
  const account = await prisma.account.findUnique({
    where: {
      id,
      userId
    },
    include: {
      linked: linked ? linked : false
    }
  });
  return account
}

export async function getAccounts({ userId, budgetId }: { userId: User["id"], budgetId: Number }) {
  return prisma.account.findMany({
    where: { userId, budgetId },
    orderBy: { balance: "desc" },
  });
}

// export async function addAccount({
//   name,
//   balance,
//   userId,
//   type,
//   categoryId
// }: Pick<Account, "id"> & { userId: User["id"]; id: string; name: string, type: string, balance: number, categoryId?: string }) {
//   // first obtain activeBudget from user:
//   const account = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//     select: {
//       activeBudget: true,
//     },
//   });

//   if (!account || !account.activeBudget) {
//     return false
//   }

//   const budgetId = account.activeBudget as string

//   return prisma.account.create({
//     data: {
//       name,
//       balance,
//       type,
//       categoryId: categoryId || null,

//       budget: {
//         connect: {
//           id: budgetId
//         }
//       },
//       user: {
//         connect: {
//           id: userId,
//         },
//       },
//       linked: {
//         connect: {
//           id: categoryId
//         }
//       }
//     },
//   });
// }

export async function addAccount({
  name,
  balance,
  userId,
  type,
  categoryId,
}: Pick<Account, "id"> & {
  userId: User["id"];
  id: string;
  name: string;
  type: string;
  balance: number;
  categoryId?: number;
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

  if (!account || !account.activeBudget) {
    return false;
  }


  const budgetId = parseInt(account.activeBudget, 10) as number;

  const accountData: {
    name: string;
    balance: number;
    type: string;
    categoryId?: number;
    budget: {
      connect: {
        id: number;
      };
    };
    user: {
      connect: {
        id: string;
      };
    };
    linked?: {
      connect: {
        id: number;
      };
    };
  } = {
    name,
    balance,
    type,
    categoryId: categoryId || null,
    budget: {
      connect: {
        id: budgetId,
      },
    },
    user: {
      connect: {
        id: userId,
      },
    },
  };

  if (categoryId) {
    accountData.linked = {
      connect: {
        id: categoryId,
      },
    };
  }

  return prisma.account.create({
    data: accountData,
  });
}


export function incrementAccountBalance({
  id,
  userId,
  value,
}: Pick<Account, "id"> & { userId: User["id"]; value: number }) {
  console.log("incrementing account balance", id, "by", value);
  return prisma.account.updateMany({
    where: { id, userId },
    data: { balance: { increment: value } },
  });
}

export function updateAccount({
  id,
  userId,
  name,
  type
}: Pick<Account, "id"> & { userId: User["id"]; id: number; name: string, type: string }) {
  return prisma.account.updateMany({
    where: { id, userId },
    data: { name, type },
  });
}

export function deleteAccount({
  id,
  userId,
}: Pick<Account, "id"> & { userId: User["id"] }) {
  console.log("deleting account", id);
  return prisma.account.deleteMany({
    where: { id, userId },
  });
}
