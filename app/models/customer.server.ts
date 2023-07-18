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

export const Create = async ({ id, userId, subscriptionId, subscriptionStatus, cardBrand, cardExpMonth, cardExpYear, cardId, cardLast }: { id: string, userId: User["id"], status: string, type: string, customerId: string, cardBrand: string, cardExpMonth: number, cardExpYear: number, cardId: string, cardLast: string }) => {

  // create subscription column in database:
  return await prisma.customer.create({
    data: {
      userId,
      id,
      subscriptionId,
      subscriptionStatus,
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

/* const customer = await UpdateDatabaseCustomer({
  id: user.customer.id,
  userId,
  subscriptionId: stripeSubscription.subscription.id,
  subscriptionStatus: 'active',
  cardBrand,
  cardExpMonth,
  cardExpYear,
  cardId,
  cardLast
}) */

export const Update = async ({ id, userId, subscriptionId, subscriptionStatus, cardBrand, cardExpMonth, cardExpYear, cardId, cardLast }: { id: string, userId: User["id"], subscriptionId: string, subscriptionStatus: string, cardBrand: string, cardExpMonth: number, cardExpYear: number, cardId: string, cardLast: string }) => { 
  // update customer record with the parameters passed:
  return await prisma.customer.update({
    where: {
      id, 
      userId
    },
    data: {
     // userId,
      subscriptionId,
      subscriptionStatus,
      cardBrand,
      cardExpMonth,
      cardExpYear,
      cardId,
      cardLast,
      // user: {
      //   connect: {
      //     id: userId,
      //   },
      // },
    },
  });
}


// set subscriptionStatus for customerid
export const SetSubscriptionCancelled = async ({ id } : { id: string }) => {
  // update customer record, setting subscriptionStatus to subscriptionStatus, for customer with id of id:
  return await prisma.customer.update({
    where: {
      id,
    },
    data: {
      subscriptionStatus : "cancelled",
      subscriptionId: null
    },
  });
}





