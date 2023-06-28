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
    <section className="flex flex-col w-full items-center ">

      <Form
        method="post"
        className="flex flex-col w-full max-w-2xl items-center justify-center p-10"

      >



        {accountState == 'type' && <>

          <h1 className="text-4xl text-center">What type of account will you be adding?</h1>
          <div className="grid grid-cols-2 gap-4 mt-5">


            <button className="flex-1 min-h-500 w-100 p-5 flex justify-center align-center border-dotted border-2 border-slate-500" type="button" onClick={() => {
              console.log("clicked!")
              setAccountType('Checking')
              setAccountState('name')
            }}>Checking</button>
            <button className="flex-1 h-500 w-100 p-5 flex justify-center align-center border-dotted border-2 border-slate-500" type="button" onClick={() => {

              setAccountType('Savings')
              setAccountState('name')
            }}>Savings</button>
            <button className="flex-1 h-500 w-100 p-5 flex justify-center align-center border-dotted border-2 border-slate-500" type="button" onClick={() => {

              setAccountType('Cash')
              setAccountState('name')
            }}>Cash</button>
            <button className="flex-1 h-500 w-100 p-5 flex justify-center align-center border-dotted border-2 border-slate-500" type="button" onClick={() => {

              setAccountType('Loan')
              setAccountState('name')
            }}>Loan</button>

          </div>
        </>}

        {accountState == 'name' && <h1 className="text-4xl text-center">Name your {accountType} account</h1>}
        {accountState == 'balance' && <h1 className="text-4xl text-center">What's the current balance?</h1>}


        <input
          name="type"
          defaultValue={accountType}
          hidden={true}
        />

        <input
          ref={nameRef}
          name="name"
          className="w-full rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          aria-invalid={actionData?.errors?.name ? true : undefined}
          aria-errormessage={
            actionData?.errors?.name ? "title-error" : undefined
          }
          hidden={accountState != 'name'}
        />


        <input
          ref={balanceRef}
          name="balance"
          className="w-full rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          aria-invalid={actionData?.errors?.balance ? true : undefined}
          aria-errormessage={
            actionData?.errors?.balance ? "title-error" : undefined
          }
          hidden={accountState != 'balance'}
        />

        <div className="flex w-full">
          {accountState == 'name' && <>
            <button className="flex-1 rounded bg-slate-600 px-4 mx-2 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600" type="button" onClick={() => {
              setAccountState('type')
            }}>Back</button>
            <button className="flex-1 rounded bg-slate-600 px-4 mx-2 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600" type="button" onClick={() => {
              setAccountState('balance')
            }}>Next</button>
          </>
          }

          {accountState == 'balance' && <>
            <button className="flex-1 rounded bg-slate-600 px-4 mx-2 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600" type="button" onClick={() => {
              setAccountState('name')
            }}>Back</button>
            <button className="flex-1 rounded bg-slate-600 px-4 mx-2 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600" type="submit">Add Account</button>
          </>}

        </div>

        <button className="rounded bg-slate-600 px-4 mx-2 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600" type="button"><Link to="/accounts">Cancel</Link></button>

      </Form>
    </section>
  )

}

