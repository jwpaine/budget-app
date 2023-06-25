import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
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

  const [accountState, setAccountState] = React.useState('type');

  const [accountType, setAccountType] = React.useState('');
  const [accountName, setAccountStateName] = React.useState('');
  const [accountBalance, setAccountBalance] = React.useState(0);




  return (
    <main>

      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >

        <h3>Add new account</h3>

        {accountState == 'type' && <div>
          <h2>Select account type</h2>
          <button type="button" onClick={() => {
            console.log("clicked!")
            setAccountType('Checking')
            setAccountState('name')
          }}>Checking</button>
          <button type="button" onClick={() => {

            setAccountType('Savings')
            setAccountState('name')
          }}>Savings</button>
          <button type="button" onClick={() => {

            setAccountType('Cash')
            setAccountState('name')
          }}>Cash</button>
          <button type="button" onClick={() => {

            setAccountType('Loan')
            setAccountState('name')
          }}>Loan</button>

        </div>
        }

        {accountState == 'name' && <h2>What should the account be called?</h2>}
        {accountState == 'balance' && <h2>What's the current balance?</h2>}


        <input
          name="type"
          defaultValue={accountType}
          hidden={true}
        />

        <input
          ref={nameRef}
          name="name"
          className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          aria-invalid={actionData?.errors?.name ? true : undefined}
          aria-errormessage={
            actionData?.errors?.name ? "title-error" : undefined
          }
          hidden={accountState != 'name'}
        />


        <input
          ref={balanceRef}
          name="balance"
          className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          aria-invalid={actionData?.errors?.balance ? true : undefined}
          aria-errormessage={
            actionData?.errors?.balance ? "title-error" : undefined
          }
          hidden={accountState != 'balance'}
        />


        {accountState == 'name' && <>
          <button type="button" onClick={() => {
            setAccountState('type')
          }}>Back</button>
          <button type="button" onClick={() => {
            setAccountState('balance')
          }}>Next</button>
        </>
        }

        {accountState == 'balance' && <>
          <button type="button" onClick={() => {
            setAccountState('name')
          }}>Back</button>
          <button type="submit">Add Account</button>
        </>}

        <button type="button"><Link to="/accounts">Cancel</Link></button>

      </Form>
    </main>
  )

}

