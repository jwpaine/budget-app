import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
// import invariant from "tiny-invariant";

import { deleteCategory } from "~/models/category.server";
import { requireUserId } from "~/session.server";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");

  const formData = await request.formData();

  const userId = await requireUserId(request);

  const id = formData.get("id") as string;

  const t = await deleteCategory({ id, userId });

  return redirect(`/accounts`);
}
