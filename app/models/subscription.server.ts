import type { User} from "@prisma/client";

import { prisma } from "~/db.server";

/*

Create async function createSubscription, which accepts the following parameters:

  id  
  userId  
  status
  type  
  customerId 
  cardBrand 
  cardExpMonth
  cardExpYear
  cardId
  cardLast

*/
export const Create = async ({ id, userId, status, type, customerId, cardBrand, cardExpMonth, cardExpYear, cardId, cardLast }: { id: string, userId: User["id"], status: string, type: string, customerId: string, cardBrand: string, cardExpMonth: number, cardExpYear: number, cardId: string, cardLast: string }) => {

  // create subscription column in database:
  return await prisma.subscription.create({
    data: {
      userId,
      id,
      status,
      type,
      customerId,
      cardBrand,
      cardExpMonth,
      cardExpYear,
      cardId,
      cardLast,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

}







