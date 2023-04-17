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
import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId } from "~/session.server";

import NewTransactionPage from "../../components/transactions/new";
import { getCategories } from "~/models/category.server";
import { Decimal } from "@prisma/client/runtime";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  const categories = await getCategories({ userId });

  return json({ userId, categories });
}

export default function Budget() {
  const data = useLoaderData<typeof loader>();

  const nameRef = React.useRef<HTMLInputElement>(null);
  const maxValueRef = React.useRef<HTMLInputElement>(null);
  const dueRef = React.useRef<HTMLInputElement>(null);
  const frequencyRef = React.useRef<HTMLInputElement>(null);

  const actionData = useActionData();
  const errors = actionData?.errors;
  const category = useFetcher();

  return (
    <div>
      <category.Form method="post" action="/category/new">
        <input ref={nameRef} name="name" placeholder="Name" />
        <input ref={maxValueRef} name="maxValue" placeholder="Amount" />

        <input ref={dueRef} name="due" placeholder="Due On" />

        <input ref={frequencyRef} name="frequency" placeholder="Frequency" />

        <button type="submit">Add Category</button>
      </category.Form>

      {data.categories?.map((c) => {
        return (
          <div key={c.id}>
            <p>Name: {c.name}</p>
            <p>CurrentValue: {c.currentValue}</p>
            <p>MaxValue: {c.maxValue}</p>
            <p>Spent: {c.spent}</p>
            <p>Due: {c.due}</p>
            <p>Frequency: {c.frequency}</p>

            <category.Form method="post" action="/category/delete">
              <input name="id" defaultValue={c.id} type="hidden" />
              <button type="submit">Delete</button>
            </category.Form>
          </div>
        );
      })}
    </div>
  );
}
