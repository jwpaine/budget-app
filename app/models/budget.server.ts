
import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function create({
    name,
    userId,
  }: {
    name: String;
    userId: User["id"];
  }) {
    const budget = await prisma.budget.create({
      data: {
        name,
        userId
      },
    });
    // if budget is not null, set the id of the newly created budget under the activeBudget column for user
    if (!budget) {
      return false;
    }
    return prisma.user.update({
        where: {
            id: userId,
        },

        data: {
            activeBudget: budget.id 
        }
    })
        
  }

  export async function getBudgets({ userId }: { userId: User["id"] }) {
    // first obtain activeBudget from user:
    return prisma.budget.findMany({
      where: { userId },
      select: { name: true, id: true }
    });
  }