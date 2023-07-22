import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link, useFetcher, useLoaderData } from "@remix-run/react";
import * as React from "react";


import { addAccount } from "~/models/account.server";
import { requireUserId } from "~/auth.server";
import { getBudgets } from "~/models/budget.server";
import { getUserById } from "~/models/user.server";


export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);

  const user = await getBudgets({ userId });

  const account = await getUserById({ id: userId, budgets: true });


  console.log("account", account)

  return json({ userId, account });
}



export default function Budgets() {

  const data = useLoaderData();

  const budget = useFetcher();

  const user = useFetcher();

  // react hook for setting activeBudget:
  const [activeBudget, setActiveBudget] = React.useState("");
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  // add use effect that sets activeBudget to data.account.activeBudget:
  React.useEffect(() => {
    if (data.account?.activeBudget) setActiveBudget(data.account.activeBudget);
  }, [data.account?.activeBudget]);

  if (confirmDelete) {
    return (
      <main className="flex flex-col w-full items-center bg-gray-950 h-full">

        <h1 className="text-white text-4xl font-bold">Warning!</h1>
        <h2 className="text-2xl text-white p-2">
          You are about to delete budget: {data.account.budgets.map((budget) => {
            if (budget.id == activeBudget) return <span className="font-bold">{budget.name}</span>
          })}
        </h2>
        <h3 className="text-white max-w-sm text-center p-5">All accounts, transactions and categories under this budget will be deleted if you proceed.</h3>

        <button type="button" className="rounded p-2 bg-emerald-500 text-white hover:bg-emerald-400 mt-3" onClick={() => setConfirmDelete(false)}>Cancel</button>

        <budget.Form
          className="flex flex-col justify-center p-1 mt-10"
          method="post"
          action="/budget/delete"
          onSubmit={() => {
            setConfirmDelete(false)
          }}

        >
          <input name="budgetId" defaultValue={activeBudget} hidden={true} />

          <button type="submit" className="rounded p-2 bg-red-500 text-white hover:bg-red-400 mt-8">Confirm Delete</button>
        </budget.Form>

      </main>
    )
  }

  return (
    <main className="flex flex-col w-full items-center bg-gray-950 h-full">

      <h1 className="text-3xl text-white">{data.account.budgets.length > 0 ? 'My Budgets' : 'Add a budget to get started'}</h1>

      <div className="flex flex-wrap my-5">
        {data.account?.budgets && data.account.budgets.map((budget) => {
          return (
            <button
              key={budget.id}
              className={`rounded flex-1 min-h-500 w-100 p-5 m-2 flex flex-col justify-center items-center  ${budget.id === activeBudget ? 'bg-sky-100' : 'bg-white'}  hover:bg-slate-100`}
              type="button"
              onClick={() => {
                console.log("clicked!");
                setActiveBudget(budget.id);
              }}
            >
              <span className="text-3xl text-black">{budget.name}</span>
              <span className="text-xl text-black">Created: {budget.createdAt.slice(0, 10)}</span>
            </button>
          );
        })}


      </div>

      {data.account.budgets.length > 0 && <user.Form
        className="flex flex-wrap justify-center p-1"
        method="post"
        action="/user/update">

        <input name="budgetId" defaultValue={activeBudget} hidden={true} />
        <button type="submit" className={`text-xl rounded-md ${activeBudget == data.account.activeBudget ? 'bg-slate-300 hover:bg-slate-300' : 'bg-white'} px-4 py-3 mx-1 font-medium text-blue-700 hover:bg-blue-50 `} disabled={activeBudget == data.account.activeBudget}>
          Switch Budget
        </button>

        <button type="button" onClick={() => setConfirmDelete(true)} className="px-4 py-3 mx-1 rounded font-medium bg-red-500 text-white hover:bg-red-400">
          Remove
        </button>

      </user.Form>}







      <budget.Form
        className="flex flex-wrap justify-center p-1 mt-10"
        method="post"
        action="/budget/new"
      >

        <input className="bg-white rounded p-2" name="name" placeholder="Budget Name" />
        <button type="submit" className="flex flex-1 items-center justify-center rounded-md  bg-white px-4 py-3 mx-1 text-base font-medium text-blue-700 hover:bg-blue-50 "
        >Add Budget</button>
      </budget.Form>

    </main>
  )
}
