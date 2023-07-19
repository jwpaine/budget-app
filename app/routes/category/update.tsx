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

  let v: any = formData.get("currentValue")

  // Remove any non-numeric, '+', '-', or '.' characters from 'v'
  v = v.replace(/[^0-9+-.]/g, '');

  if (v === '') {
    console.log("v is blank after sanitization")
    redirect("/budget")
  }

  // Check if 'v' is not empty
  let currentValue = 0;

  if (!isNaN(v)) {
    // `v` is a number
    console.log("v is a number.");
    currentValue = parseFloat(v);

  } else {
    // `v` is not a number
    console.log("v is not a number.");
    // Check if 'v' contains a '+' or '-' symbol
    if (v.includes('+') || v.includes('-')) {
      // Find the last occurrence of '+' or '-'
      const lastOperatorIndex = Math.max(v.lastIndexOf('+'), v.lastIndexOf('-'));

      // Extract the numbers before and after the operator
      const a = parseFloat(v.slice(0, lastOperatorIndex));
      const b = parseFloat(v.slice(lastOperatorIndex + 1));

      // Perform the corresponding operation
      if (v.charAt(lastOperatorIndex) === '+') {
        currentValue = a + b;
      } else {
        currentValue = a - b;
      }
    } else {
      // If 'v' doesn't contain '+' or '-', directly parse it as a number
      currentValue = parseFloat(v);
    }

  }

  if(!currentValue) {
    console.log("currentValue is not a number")
    redirect("/budget")
  }

  console.log("currentValue: ", currentValue)





  //  v = v.replace(/[^0-9+-.]/g, '');

  // // console.log("v after replace: ", v)

  // let sum = v.split("+")
  // let diff = v.split("-")

  // console.log("sum 0, 1: ", sum[0], sum[1])
  // console.log("diff 0, 1: ", diff[0], diff[1])


  // if (sum.length > 1 && diff.length > 1) {
  //   console.log("cannot combine both + and -")
  //   return redirect(`/accounts/${accountId}`);
  // }


  // const currentValue = sum.length > 1 ? (Number(sum[0]) + Number(sum[1])) : diff.length > 1 ? (Number(diff[0]) - Number(diff[1])) : Number(v)




  // @TODO ALWAYS setBudget if only currentValue is updated (not name, due, maxValue)
  if (action && action == "setBudget") {
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
