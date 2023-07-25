import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId } from "~/auth.server";
import NewTransactionPage from "../../components/transactions/new";

import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "~/models/transaction.server";
import { incrementAccountBalance } from "~/models/account.server";
import { Decimal } from "@prisma/client/runtime";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const id = parseInt(formData.get("id") as string, 10);
  const accountId = parseInt(formData.get("accountId") as string, 10);
  
  const date = new Date(formData.get("date") as string) as Date;

  if (isNaN(date.getTime())) {
    console.log("date is not a date")
    return redirect(`/accounts/${accountId}`);
  }


  const payee = (formData.get("payee") as string) || "";
  const category = parseInt(formData.get("category") as string, 10) as number || null
  const memo = (formData.get("memo") as string) || "";

  let newInflow = Number((formData.get("inflow") as string).replace(/[^0-9.]/g, "")) || 0
  newInflow = Math.round(newInflow * 1e2) / 1e2

  let newOutflow = Number((formData.get("outflow") as string).replace(/[^0-9.]/g, "")) || 0
  newOutflow = Math.round(newOutflow * 1e2) / 1e2



  const t = await updateTransaction({
    id,
    date,
    payee,
    category,
    memo,
    newInflow,
    newOutflow,
    userId,
  });

  return redirect(`/accounts/${accountId}`);
}
