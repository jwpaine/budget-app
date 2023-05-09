import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

import { initUserCategories } from "./category.server";

export type { User } from "@prisma/client";


export async function getUserById(id: User["id"]) {
  try {
    return prisma.user.findUnique({ where: { id } });
  } catch(e) {
    return null
  }
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], id: User["id"]) {
  let userId = id
  const createUser = await prisma.user.create({
    data: {
      email,
      id
    },
  });

  if (createUser) {
    return await initUserCategories({userId}) 
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
