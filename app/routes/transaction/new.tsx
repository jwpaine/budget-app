import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId, trialExpired } from "~/auth.server";
import { create as CreateCategoryAdjustment } from "~/models/categoryAdjustment";
import NewTransactionPage from "../../components/transactions/new";



import {
  createTransaction
} from "~/models/transaction.server";
import { incrementAccountBalance } from "~/models/account.server";
import { Decimal } from "@prisma/client/runtime";
import { get } from "http";
import { getUserById } from "~/models/user.server";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");
  const userId = await requireUserId(request);
  const user = await getUserById({ id: userId})
  if(await trialExpired({ account: user })) {
    return redirect("/account")
  }


  const formData = await request.formData();

  const type = (formData.get("type") as string) || "";

  if (type == "transfer") {

    const fromId = parseInt(formData.get("fromId") as string, 10) as number;
    const toId = parseInt(formData.get("toId") as string, 10) as number;

    


    const originatingAccountId = parseInt(formData.get("accountId") as string, 10) as number;

    let v = formData.get("value") as string
    const value = Number(v.replace(/[^0-9.]/g, "")).toFixed(2)


    const date = new Date(formData.get("date") as string) as Date;

    console.log(`new transfer: ${fromId} -> ${value} -> ${toId} `)


    // outflow ------------------------

    let payee = ""
    let category = null
    let accountId = fromId
    let memo = ""
    let inflow = 0
    let outflow = Number(value)
    let id = fromId

    const t_From = await createTransaction({
      accountId,
      date,
      payee,
      category,
      memo,
      inflow,
      outflow,
      userId,
      type: "T"
    });
    // update account balance


    const a = await incrementAccountBalance({ id, userId, value: -value });

    // inflow --------------------------


    accountId = toId
    inflow = Number(value)
    outflow = 0
    id = toId


    const t_To = await createTransaction({
      accountId,
      date,
      payee,
      category,
      memo,
      inflow,
      outflow,
      userId,
      type: "T"
    });
    // update account balance


    const b = await incrementAccountBalance({ id, userId, value });


    return redirect(`/accounts/${originatingAccountId}`);
  }

  const accountId = parseInt(formData.get("accountId") as string, 10) as number;

  const date = new Date(formData.get("date") as string) as Date;

  if (isNaN(date.getTime())) {
    console.log("date is not a date")
    return redirect(`/accounts/${accountId}`);
  }


  const payee = (formData.get("payee") as string) || "";
 
  const category = parseInt(formData.get("category") as string, 10) as number;
  const memo = (formData.get("memo") as string) || "";


  let outflow = Number((formData.get("outflow") as string).replace(/[^0-9.]/g, "")) || 0
  outflow = Math.abs(Math.round(outflow * 1e2) / 1e2)

  let inflow = Number((formData.get("inflow") as string).replace(/[^0-9.]/g, "")) || 0
  inflow = Math.abs(Math.round(inflow * 1e2) / 1e2)

  if (inflow > 0 && outflow > 0) {
    console.log("both inflow and outflow are > 0, this is not allowed")
    return redirect(`/accounts/${accountId}`);
  }





  // @TODO: To/From payee = account transfers
  // create transaction
  const t = await createTransaction({
    accountId,
    date,
    payee,
    category,
    memo,
    inflow,
    outflow,
    userId,
    type
  });
  // update account balance
  const value = inflow > 0 ? inflow : -outflow

  console.log('value:', value)
  let id = accountId as number;
  const a = await incrementAccountBalance({ id, userId, value });



  const account = await getAccount({ id: accountId, userId, linked: true })

  const linkedCategory = account?.linked?.id

  if (linkedCategory && type != "R") {
    const categoryAdjustment = await CreateCategoryAdjustment({userId, categoryId: linkedCategory, value: -value, window: date })
  }


  // if account.categoryId then we know we have a linked account (CC repayment category), so we need to create a CategoryTransaction for that category, with value
  // if (account?.categoryId) {
  //   console.log("account has categoryId, creating CategoryTransaction")

  // }


  return redirect(`/accounts/${accountId}`);
}
