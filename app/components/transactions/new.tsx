import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createTransaction } from "~/models/transaction.server";
import { requireUserId } from "~/auth.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  // const name = formData.get("name");
  // const balance = Number(formData.get("balance"))

  // if (typeof name !== "string" ) {
  //   return json(
  //     { errors: { name: "Name is required" } },
  //     { status: 400 }
  //   );
  // }

  // if (typeof balance !== "number" ) {
  //   return json(
  //     { errors: { balance: "Balance must be a number" } },
  //     { status: 400 }
  //   );
  // }

  const accountId = "clfj3k4zk0000tg8wdxwawj8q";
  const date = "20230323";
  const payee = "Geiger";
  const category = "P";
  const memo = "test";
  const inflow = 825.0;
  const outflow = 0;

  const note = await createTransaction({
    accountId,
    date,
    payee,
    category,
    memo,
    inflow,
    outflow,
  });

  //  return redirect(`/accounts`);
}

export default function NewTransactionPage() {
  const actionData = useActionData<typeof action>();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const balanceRef = React.useRef<HTMLTextAreaElement>(null);

  // React.useEffect(() => {
  //   if (actionData?.errors?.name) {
  //     nameRef.current?.focus();
  //   }
  // }, [actionData]);

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
      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Add
        </button>
      </div>
    </Form>
  );
}
