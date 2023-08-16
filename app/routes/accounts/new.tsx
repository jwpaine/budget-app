import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import * as React from "react";


import { addAccount } from "~/models/account.server";
import { requireUserId, trialExpired } from "~/auth.server";
import { createCategory } from "~/models/category.server";
import { getUserById } from "~/models/user.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const user = await getUserById({ id: userId})
  if(await trialExpired({ account: user })) {
    return redirect("/account")
  }

  const formData = await request.formData();
  let name = formData.get("name") as string
  const type = formData.get("type") as string

  console.log("received type: ", type)

  if (type == "Checking") name = "💳 " + name
  if (type == "Savings") name = "💰 " + name
  if (type == "Cash") name = "💵 " + name
  if (type == "Loan") name = "🏦 " + name


  // remove all non-numeric characters except decimal and minus
  let balance = Number((formData.get("balance") as string).replace(/[^0-9.]/g, ""))
  // replace '-' with "" only if it is NOT the first character:
  balance = Number(balance.toString().replace(/-/, (balance.toString().indexOf('-') == 0 ? "" : "-")))
  balance = Math.round(balance * 1e2) / 1e2

  // if account type is "Loan", make balance negative:
  if (type == "Loan") {
    balance = balance * -1
  }


  if (typeof name !== "string") {
    return json({ errors: { name: "Name is required" } }, { status: 400 });
  }

  console.log("\balance type ", typeof balance)

  if (typeof balance !== "number") {
    return redirect(`accounts/new`)
    // return json(
    //   { errors: { balance: "Balance must be a number" } },
    //   { status: 400 }
    // );
  }


  // if account type is loan, add a linked category  (category.accountId = account.id) with a name matching new account name:

  if (type == "Loan") {
    let maxValue = 0;
    let currentValue = 0;
    let spent = 0;
    const c = await createCategory({
      name,
      maxValue: 0,
      currentValue: 0,
      spent: 0,
      frequency : "M",
      userId
    });

    const cid = c.id as number
  
    const account = await addAccount({ name, type, balance, userId, categoryId: cid })
    return redirect(`/budget`);
  }

  const account = await addAccount({ name, type, balance, userId});

  return redirect(`/budget`);




  
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
    <main className="flex flex-col w-full items-center bg-gray-950 h-full">


      <Form
        method="post"
        className="flex flex-col w-full max-w-sm items-center justify-center p-10"

      >



        {accountState == 'type' && <>

          <h1 className="text-3xl text-white text-center">Select Account Type</h1>
          <div className="grid grid-cols-2 gap-4 mt-5">


            <button className={`rounded flex-1 min-h-500 w-100 p-5 flex flex-col justify-center items-center  ${accountType == "Checking" ? 'bg-sky-100' : 'bg-white'}  hover:bg-slate-100`} type="button" onClick={() => {
              console.log("clicked!")
              setAccountType('Checking')
              setAccountState('name')
            }}><span className="text-4xl">💳</span> <span className="text-xl">Checking</span></button>

            <button className={`rounded flex-1 min-h-500 w-100 p-5 flex flex-col justify-center items-center  ${accountType == "Savings" ? 'bg-sky-100' : 'bg-white'}  hover:bg-slate-100`} type="button" onClick={() => {

              setAccountType('Savings')
              setAccountState('name')
            }}><span className="text-4xl">💰</span> <span className="text-xl">Savings</span></button>

            <button className={`rounded bg-white flex-1 min-h-500 w-100 p-5 flex flex-col justify-center items-center ${accountType == "Cash" ? 'bg-sky-100' : 'bg-white'} hover:bg-slate-100`} type="button" onClick={() => {

              setAccountType('Cash')
              setAccountState('name')
            }}><span className="text-4xl">💵</span> <span className="text-xl">Cash</span></button>

            <button className={`rounded bg-white flex-1 min-h-500 w-100 p-5 flex flex-col justify-center items-center  ${accountType == "Loan" ? 'bg-sky-100' : 'bg-white'} hover:bg-slate-100`} type="button" onClick={() => {

              setAccountType('Loan')
              setAccountState('name')
            }}><span className="text-4xl">🏦</span> <span className="text-xl">Loan</span></button>

          </div>
        </>}

        {accountState == 'name' && <h1 className="text-3xl text-white text-center">Name your {accountType}</h1>}
        {accountState == 'balance' && <h1 className="text-3xl text-white text-center">Current balance?</h1>}


        <input
          name="type"
          defaultValue={accountType}
          hidden={true}
        />

        <input
          ref={nameRef}
          name="name"
          className="w-full rounded-md px-3 my-5 text-lg leading-loose placeholder-gray-800 focus:outline-none "
          aria-invalid={actionData?.errors?.name ? true : undefined}
          aria-errormessage={
            actionData?.errors?.name ? "title-error" : undefined
          }
          hidden={accountState != 'name'}
        />


        <input
          ref={balanceRef}
          name="balance"
          className="w-full rounded-md px-3 my-5 text-lg leading-loose placeholder-gray-800 focus:outline-none "
          aria-invalid={actionData?.errors?.balance ? true : undefined}
          aria-errormessage={
            actionData?.errors?.balance ? "title-error" : undefined
          }
          hidden={accountState != 'balance'}
          type="number"
          step="0.01"
        />

        <div className="flex w-full">
          {accountState == 'name' && <>
            <button className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 mx-1 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 "
              type="button" onClick={() => {
                setAccountState('type')
              }}>Back</button>
            <button className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 mx-1 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 "
              type="button" onClick={() => {
                setAccountState('balance')
              }}>Next</button>
          </>
          }

          {accountState == 'balance' && <>
            <button className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 mx-1 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 " type="button" onClick={() => {
                setAccountState('name')
              }}>Back</button>
            <button className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 mx-1 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 " type="submit">Add Account</button>
          </>}

        </div>

        <Link className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-1 my-20 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 "
          to="/budget">Cancel</Link>

      </Form>
    </main>
  )

}

