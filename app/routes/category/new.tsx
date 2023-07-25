import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId } from "~/auth.server";
import NewTransactionPage from "../../components/transactions/new";

import { createCategory, getCategories } from "~/models/category.server";
import { incrementAccountBalance } from "~/models/account.server";
import { Decimal } from "@prisma/client/runtime";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const name = formData.get("name") as string;
  const maxValue = 0;
  const frequency = formData.get("frequency") as string || "M"
  const startDate = formData.get("window") as string
  const budgetId = parseInt(formData.get("budgetId") as string, 10) as number;

  const currentValue = 0;
  const spent = 0;


  const due = new Date(new Date().toISOString().slice(0, 10))


  const t = await createCategory({
    name,
    maxValue,
    currentValue,
    spent,
    frequency,
    userId,
    due
  });

  const categories = await getCategories({ userId, budgetId, startDate });

  return json({ categories });


}
