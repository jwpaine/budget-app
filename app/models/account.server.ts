import type { User, Account } from "@prisma/client";

import { prisma } from "~/db.server";

export function getAccount({
  id,
  userId,
}: Pick<Account, "id"> & {
  userId: User["id"];
}) {
  return prisma.account.findFirst({
    select: { id: true, name: true, balance: true },
    where: { id, userId },
  });
}

export function getAccounts({ userId }: { userId: User["id"] }) {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { balance: "desc" },
  });
}

export function addAccount({
  name,
  balance,
  userId,
}: Pick<Account, "id"> & {
  userId: User["id"];
}) {
  return prisma.account.create({
    data: {
      name,
      balance,
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
}: Pick<Account, "id"> & { userId: User["id"]; id: string; name: string }) {
  return prisma.account.updateMany({
    where: { id, userId },
    data: { name },
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
