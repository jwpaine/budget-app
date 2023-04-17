import type { Product } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Product } from "@prisma/client";

export async function getProduct(id: number) {
  return prisma.product.findUnique({ where: { id } });
}

export function getProducts() {
  return prisma.product.findMany();
}
