import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { deleteAccount } from "~/models/account.server";
import { requireUserId } from "~/auth.server";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");

  const formData = await request.formData();

  const userId = await requireUserId(request);


  const id = parseInt(formData.get("accountId") as string, 10) as number;

  const t = await deleteAccount({ id, userId });

  return redirect(`/budget`);
}
