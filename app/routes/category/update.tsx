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

  const currentValue = Number(formData.get("currentValue")) || 0;



  if(action && action == "setBudget") {
    console.log("id-->: ", id)
    const t = await setBudget({
      id,
      userId,
      currentValue
     });
     return redirect(`/accounts/${accountId}`);
  }

 
  const name = (formData.get("name") as string) || "";
  
  const due = new Date(formData.get("due") as string) as Date;
  const maxValue = Number(formData.get("needed")) || 0;

  const t = await updateCategory({
   id,
   name,
   currentValue,
   due,
   maxValue,
   userId
  });

  return redirect(`/accounts/${accountId}`);
}
