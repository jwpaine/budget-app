import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId } from "~/auth.server";
import NewTransactionPage from "../../components/transactions/new";

import {
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
  // remove all non-numeric characters except decimal
  let v = formData.get("currentValue") as string

  let b = formData.get("balance") as string
  const balance = b ? b.replace(/[^0-9.]/g, "") : 0

  let nB = formData.get("newBalance") as string
  const newBalance = nB ? nB.replace(/[^0-9.+-]/g, "") : ""





  // if budget is "resolved" then simply update current Value
  if (action && action == "setBudget") {
    let currentValue = Number(v.replace(/[^0-9.]/g, ""))
    console.log("newBalance: ", newBalance)
    console.log("balance: ", balance)
  
    const t = await setBudget({
      id,
      userId,
      currentValue
    });
    return redirect(`/budget`);
  }



  const name = (formData.get("name") as string) || "";
  const due = new Date(formData.get("due") as string) as Date;
  const maxValue = Number(formData.get("needed")) || 0;

  // if (newBalance.indexOf("+") == -1 && newBalance.indexOf("-") == -1) {
  //   const currentValue = Number(newBalance)
  //   const t = await updateCategory({
  //     id,
  //     name,
  //     currentValue,
  //     due,
  //     maxValue,
  //     userId
  //   });

  //   return redirect(`/budget`);
  // }

  // check if newBalance is a real number. If so, declare currentValue as newBalance:
  // if (!isNaN(Number(newBalance))) {
  //   console.log("newBalance is a number. Updating category with currentValue: ", newBalance)
  //   const currentValue = Number(newBalance)

  //   const t = await updateCategory({
  //     id,
  //     name,
  //     currentValue,
  //     due,
  //     maxValue,
  //     userId
  //   });

  //   return redirect(`/budget`);

  // }
  console.log("balance: ", balance)
  console.log("newBalance: ", newBalance)
  console.log("v: ", v)

  if(!isNaN(Number(newBalance))) {

    const currentValue = Number(v) + Number(newBalance) - Number(balance)

    console.log("newBalance is a number. Updating category with currentValue: ", currentValue)


    const t = await updateCategory({
      id,
      name,
      currentValue,
      due,
      maxValue,
      userId
    });
  
    return redirect(`/budget`);

  }

  let sum = newBalance.split("+")
  let diff = newBalance.split("-")

  if (sum.length > 1 && diff.length > 1) {
    console.log("canot combine both + and -")
    return redirect(`/budget`);
  }

  console.log("sum: ", sum)
  console.log("diff: ", diff)
  console.log("balance: ", balance)
  console.log("newBalance: ", newBalance)


  let dB = sum.length > 1 ? (Number(sum[0]) + Number(sum[1]) - Number(balance)) : diff.length > 1 ? (Number(diff[0]) - Number(diff[1]) - Number(balance)) : Number(newBalance) - Number(balance)

  console.log("dB: ", dB)


  const currentValue = Number(v.replace(/[^0-9.]/g, "")) + dB

  const t = await updateCategory({
    id,
    name,
    currentValue,
    due,
    maxValue,
    userId
  });

  return redirect(`/budget`);


}
