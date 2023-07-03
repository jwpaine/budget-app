import { Link } from "@remix-run/react";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useCatch,
  useLoaderData,
  useActionData,
  useFetcher,
} from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";

import { requireUserId } from "~/auth.server";


import { getCategories } from "~/models/category.server";
import { Decimal } from "@prisma/client/runtime";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  const categories = await getCategories({ userId });

  return json({ userId, categories });
}

export default function Budget() {
  const data = useLoaderData<typeof loader>();



  return (
    <main>
      <h1>My Account</h1>

      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>

    </main>
  );
}
