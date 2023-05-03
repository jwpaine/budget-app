import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId } from "~/auth.server";
import NewTransactionPage from "../../components/transactions/new";

import { updateAccount } from "~/models/account.server";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const id = formData.get("accountId") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;

  const t = await updateAccount({ id, userId, name, type });

  return redirect(`/accounts/${id}`);
}
