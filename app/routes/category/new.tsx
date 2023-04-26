import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId } from "~/session.server";
import NewTransactionPage from "../../components/transactions/new";

import { createCategory } from "~/models/category.server";
import { incrementAccountBalance } from "~/models/account.server";
import { Decimal } from "@prisma/client/runtime";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const name = formData.get("name") as string;
  const maxValue = Number(formData.get("maxValue")) as number || 0;
  // const due = Number(formData.get("due"));
  const frequency = formData.get("frequency") as string || "M"

  const currentValue = 0;
  const spent = 0;

  const t = await createCategory({
    name,
    maxValue,
    currentValue,
    spent,
    frequency,
    userId,
  });

  return redirect(`/accounts`);
}
