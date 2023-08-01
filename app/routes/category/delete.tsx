import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
// import invariant from "tiny-invariant";

import { deleteCategory, getCategories } from "~/models/category.server";
import { requireUserId, trialExpired } from "~/auth.server";
import { getUserById } from "~/models/user.server";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");

  const userId = await requireUserId(request);
  const account = await getUserById({ id: userId})
  if(await trialExpired({ account })) {
    return redirect("/account")
  }

  const formData = await request.formData();

  const id = parseInt(formData.get("id") as string, 10) as number;

  const startDate = formData.get("window") as string
  const budgetId = parseInt(formData.get("budgetId") as string, 10) as number;


  console.log('deleting category:', id)

  const t = await deleteCategory({ id, userId });

  const categories = await getCategories({ userId, budgetId, startDate });

  return json({ categories });

}
