import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function create({userId, categoryId, value, window}: {userId: User["id"], categoryId: string, value: number, window: string}) {
    
    return prisma.categoryAdjustment.create({
        data: {
            userId,
            categoryId,
            value,
            window
          }
      })
}