import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { addAccount } from "~/models/account.server";
import { requireUserId } from "~/auth.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name") as string
  const type = formData.get("type") as string

  console.log("received type: ", type)



  const balance = Number(formData.get("balance"));

  if (typeof name !== "string") {
    return json({ errors: { name: "Name is required" } }, { status: 400 });
  }

  if (typeof balance !== "number") {
    return json(
      { errors: { balance: "Balance must be a number" } },
      { status: 400 }
    );
  }

  const note = await addAccount({ name, type, balance, userId });

  return redirect(`/accounts`);
}

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const balanceRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Account Name: </span>
          <input
            ref={nameRef}
            name="name"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.name}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Account Balance: </span>
          <input
            ref={balanceRef}
            name="balance"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.balance ? true : undefined}
            aria-errormessage={
              actionData?.errors?.balance ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.balance && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.balance}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Account Type: </span>
          <select name="type">
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="cash">Cash</option>
            <option value="loan">Loan / Credit Card</option>
          </select>
        </label>
        {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.name}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
