import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId } from "~/auth.server";
import NewTransactionPage from "../../components/transactions/new";

import {
  getCategories,
  setBudget,
  updateCategory
} from "~/models/category.server";
import { incrementAccountBalance } from "~/models/account.server";
import { Decimal } from "@prisma/client/runtime";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const accountId = formData.get("accountId") as string;
  const action = formData.get("action") as string;
  const id = formData.get("id") as string;
  const window = new Date(formData.get("window") as string) as Date;
  const budgetId = formData.get("budgetId") as string;
  const startDate = formData.get("window") as string

  let v = formData.get("currentValue") as string

  console.log("v: ", v)
  // remove anything accept for numbers, +, and - from v:
  v = v.replace(/[^0-9+-.]/g, '')

  console.log("v after replace: ", v)

  let sum = v.split("+")
  let diff = v.split("-")

  if (sum.length > 1 && diff.length > 1) {
    console.log("canot combine both + and -")
    return redirect(`/accounts/${accountId}`);
  }

  console.log("sum 0, 1: ", sum[0], sum[1])
  console.log("diff 0, 1: ", diff[0], diff[1])

 
  const currentValue = sum.length > 1 ? (Number(sum[0]) + Number(sum[1])) : diff.length > 1 ? (Number(diff[0]) - Number(diff[1])) : Number(v)

  console.log("currentValue: ", currentValue)


  // @TODO ALWAYS setBudget if only currentValue is updated (not name, due, maxValue)
  if(action && action == "setBudget") {
    console.log("id-->: ", id)
    const t = await setBudget({
      id,
      userId,
      currentValue,
      window
     });
     const categories = await getCategories({ userId, budgetId, startDate });

     return json({ categories });
  }

 
  const name = (formData.get("name") as string) || "";
  
  const due = new Date(formData.get("due") as string) as Date;
  let max = formData.get("needed") as string
  const maxValue = Number(max.replace(/[^0-9+-.]/g, '')) || 0 as number

 
  const t = await updateCategory({
   id,
   name,
   currentValue,
   due,
   maxValue,
   userId,
   window
  });
 

  const categories = await getCategories({ userId, budgetId, startDate });

  return json({ categories });

 // return redirect(`/budget`);
}
