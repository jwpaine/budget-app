import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

import { initUserCategories } from "./category.server";

export type { User } from "@prisma/client";

export async function setActiveBudget({ userId, budgetId }: { userId: User["id"], budgetId: number }) {
  // make sure userId is present on budget with budgetId:
  const budget = await prisma.budget.findMany({
    where: {
      id: budgetId,
      userId: userId
    }
  })

  if (!budget) {
    return false
  }

  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      activeBudget: budgetId
    }
  })
}

export async function getUserById({id, budgets, customer, referral} : {id: User["id"], budgets?: boolean, customer?: boolean, referral?: boolean}) {
  console.log("Looking up user by Id: ", id)
  try {
    // use prisma.user.findUnique({ where: { id } }); to find user, but join budget on budget id = user.activeBudget to get budget name:
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        budgets: budgets ? true : false,
        customer: customer ? true : false,
        referral: referral ? referral : false
      }
    });
    console.log("user: ", user)
    return user
  } catch (e) {
    console.log(e)
    return null
  }
}


// unused so far
export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], id: User["id"]) {
  let userId = id

  console.log("creating default budget for user: ", userId)

  // create default budget for user:

  const createUser = await prisma.user.create({
    data: {
      email,
      id
    },
  });

  if (createUser) {
    
    const budget = await prisma.budget.create({
      data: {
        name: "Default",
        userId
      }
    })

    if (!budget) {
      return false
    }

  
    const budgetId = budget.id
    // update user's activeBudget to be the newly created budget:
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        activeBudget: budgetId
      }
    })

    if (!updatedUser) {
      return false
    }

    return initUserCategories({ userId, budgetId })

  }
  return false
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
