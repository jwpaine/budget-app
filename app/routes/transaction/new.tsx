import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId } from "~/auth.server";
import NewTransactionPage from "../../components/transactions/new";

import {
  createTransaction
} from "~/models/transaction.server";
import { incrementAccountBalance } from "~/models/account.server";
import { Decimal } from "@prisma/client/runtime";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const type = formData.get("type") as string;

  if (type == "transfer") {

    const fromId = formData.get("fromId") as string;
    const toId = formData.get("toId") as string;
    const originatingAccountId = formData.get("accountId") as string;

    let v = formData.get("value") as string
    const value = Number(v.replace(/[^0-9.]/g, "")).toFixed(2)


    const date = new Date(formData.get("date") as string) as Date;

    console.log(`new transfer: ${fromId} -> ${value} -> ${toId} `)


    // outflow ------------------------

    let payee = ""
    let category = "Transfer"
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
    });
    // update account balance


    const b = await incrementAccountBalance({ id, userId, value });


    return redirect(`/accounts/${originatingAccountId}`);
  }

  const accountId = formData.get("accountId") as string;
  const date = new Date(formData.get("date") as string) as Date;
  const payee = (formData.get("payee") as string) || "";
  const category = (formData.get("category") as string) || "";
  const memo = (formData.get("memo") as string) || "";

  let outflow = Number((formData.get("outflow") as string).replace(/[^0-9.]/g, "")) || 0
  outflow = Math.abs(Math.round(outflow * 1e2) / 1e2)

  let inflow = Number((formData.get("inflow") as string).replace(/[^0-9.]/g, "")) || 0
  inflow = Math.abs(Math.round(inflow * 1e2) / 1e2)

  if(inflow > 0 && outflow > 0) {
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
  });
  // update account balance
  const value = inflow > 0 ? inflow : -outflow

  console.log('value:', value)
  let id = accountId as string;
  const a = await incrementAccountBalance({ id, userId, value });

  return redirect(`/accounts/${accountId}`);
}
