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

  const id = formData.get("id") as string;
  const accountId = formData.get("accountId") as string;
  const date = new Date(formData.get("date") as string) as Date;
  const payee = (formData.get("payee") as string) || "";
  const category = (formData.get("category") as string) || "Uncategorized";
  const memo = (formData.get("memo") as string) || "";
  const newInflow = Number(formData.get("inflow")) || 0;
  const newOutflow = Number(formData.get("outflow")) || 0;

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
