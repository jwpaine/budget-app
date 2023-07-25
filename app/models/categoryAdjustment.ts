import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function create({userId, categoryId, value, window}: {userId: User["id"], categoryId: number, value: number, window: Date}) {
    
    return prisma.categoryAdjustment.create({
        data: {
            userId,
            categoryId,
            value,
            window
          }
      })
}