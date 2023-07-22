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

export const retrieve = async ({ id }: { id: string }) => {
  console.log(`retrieving stripe customer: ${id} from database`)
  // retrieve customer record from database:
  return await prisma.customer.findUnique({
    where: {
      id,
    },
  });
}

export const Create = async ({ id, userId}: { id: string, userId: User["id"]}) => {
  console.log("creating customer")
  // create subscription column in database:
  return await prisma.customer.create({
    data: {
      userId,
      id,
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

export const Update = async ({ id, userId, subscriptionId, subscriptionStatus, }: { id: string, userId: User["id"], subscriptionId: string, subscriptionStatus: string }) => { 
  console.log("update customer")
  // update customer record with the parameters passed:
  return await prisma.customer.update({
    where: {
      id, 
      userId
    },
    data: {
     // userId,
      subscriptionId,
      subscriptionStatus
    },
  });
}


// set subscriptionStatus for customerid
export const SetSubscriptionCancelled = async ({ id } : { id: string }) => {
  // update customer record, setting subscriptionStatus to subscriptionStatus, for customer with id of id:
  console.log("marking subscription as cancelled")
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





