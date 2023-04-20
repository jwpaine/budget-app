import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { deleteAccount } from "~/models/account.server";
import { requireUserId } from "~/session.server";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");

  const formData = await request.formData();

  const userId = await requireUserId(request);

  const id = formData.get("accountId") as string;

  const t = await deleteAccount({ id, userId });

  return redirect(`/accounts`);
}
