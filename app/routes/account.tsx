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
    <main className="bg-black h-full flex items-center justify-center content-center">
      <h1>My Account</h1>

      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded p-5 text-blue-100 border border-slate-500 hover:font-bold"
        >
          Logout
        </button>
      </Form>

    </main>
  );
}
