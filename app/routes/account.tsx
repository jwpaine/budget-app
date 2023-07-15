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
import { getAccount } from "~/models/account.server";
import { getUserById } from "~/models/user.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);

  // const account = await getAccount({ userId });
  const user = await getUserById( userId );

  return json({ userId, user });
}

export default function Budget() {
  const data = useLoaderData<typeof loader>();



  return (
    <main className="bg-black h-full flex flex-col items-center">
      <h1>My Account</h1>
      <div className="p-2">
        <p className="text-white">Currently logged in as: {data?.user?.email}</p>
        {/* <p className="text-white">{JSON.stringify(data?.user)} </p> */}
      </div>
      <Form action="/logout" method="post" className="p-2">
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
