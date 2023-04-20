import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId } from "~/session.server";
import NewTransactionPage from "../../components/transactions/new";

import {
  createTransaction,
  getTransactions,
  deleteTransaction,
} from "~/models/transaction.server";
import { incrementAccountBalance } from "~/models/account.server";
import { Decimal } from "@prisma/client/runtime";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const accountId = formData.get("accountId") as string;
  const date = new Date(formData.get("date") as string) as Date;
  const payee = (formData.get("payee") as string) || "";
  const category = (formData.get("category") as string) || "";
  const memo = (formData.get("memo") as string) || "";
  const inflow = Number(formData.get("inflow")) || 0;
  const outflow = Number(formData.get("outflow")) || 0;

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
  const value = inflow > 0 ? inflow : -outflow;
  let id = accountId as string;
  const a = await incrementAccountBalance({ id, userId, value });

  return redirect(`/accounts/${accountId}`);
}
