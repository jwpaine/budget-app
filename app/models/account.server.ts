import type { User, Account } from "@prisma/client";
import { S } from "vitest/dist/types-94cfe4b4";

import { prisma } from "~/db.server";

export function getAccount({
  id,
  userId,
}: Pick<Account, "id"> & {
  userId: User["id"];
}) {
  return prisma.account.findFirst({
    select: { id: true, name: true, balance: true, type: true },
    where: { id, userId },
  });
}

export function getAccounts({ userId, budgetId }: { userId: User["id"], budgetId: string }) {
  return prisma.account.findMany({
    where: { userId, budgetId },
    orderBy: { balance: "desc" },
  });
}

export async function addAccount({
  name,
  balance,
  userId,
  type
}: Pick<Account, "id"> & { userId: User["id"]; id: string; name: string, type: string, balance: number}) {
    // first obtain activeBudget from user:
    const account = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        activeBudget: true,
      },
    });

    if(!account || !account.activeBudget) {
      return false
    }

    const budgetId = account.activeBudget as string

  return prisma.account.create({
    data: {
      name,
      balance,
      type,
   
      budget: {
        connect: {
          id: budgetId
        }
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
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
}: Pick<Account, "id"> & { userId: User["id"]; id: string; name: string, type: string }) {
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
