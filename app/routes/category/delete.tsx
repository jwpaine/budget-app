import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
// import invariant from "tiny-invariant";

import { deleteCategory, getCategories } from "~/models/category.server";
import { requireUserId } from "~/auth.server";

export async function action({ request, params }: ActionArgs) {
  //  invariant(params.accountId, "noteId not found");

  const formData = await request.formData();
  const userId = await requireUserId(request);
  const id = formData.get("id") as string;
  const startDate = formData.get("window") as string
  const budgetId = formData.get("budgetId") as string

  console.log('deleting category:', id)

  const t = await deleteCategory({ id, userId });

  const categories = await getCategories({ userId, budgetId, startDate });

  return json({ categories });

}
