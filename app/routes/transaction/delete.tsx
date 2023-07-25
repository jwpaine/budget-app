import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId } from "~/auth.server";
import NewTransactionPage from "../../components/transactions/new";

import {
  deleteTransaction,
} from "~/models/transaction.server";
import { Decimal } from "@prisma/client/runtime";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");

  const formData = await request.formData();

  const userId = await requireUserId(request);

  const accountId = parseInt(formData.get("accountId") as string, 10) as number;
  const id =  parseInt(formData.get("transactionId") as string, 10) as number;


  // if (date == "a") {
  //     return {
  //         errors: {
  //           date: "Please supply date",
  //         },
  //       };
  // }

  const t = await deleteTransaction({ id, userId });

  //@TODO update account balance

  return redirect(`/accounts/${accountId}`);
}
