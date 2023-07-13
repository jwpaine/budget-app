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

  const account = await getUserById(userId)

  


  return json({ userId, account });
}



export default function Budgets() {

  const data = useLoaderData();

  const budget = useFetcher();

  const user = useFetcher();

  // react hook for setting activeBudget:
  const [activeBudget, setActiveBudget] = React.useState("");

  return (
    <main className="flex flex-col w-full items-center bg-gray-950 h-full">

      <h1 className="text-3xl text-white">My Budgets</h1>

      <div className="flex flex-wrap">
        {data.account.budgets?.map((budget) => {
          return <button key={budget.id} className={`rounded flex-1 min-h-500 w-100 p-5 flex flex-col justify-center items-center  ${budget.id == activeBudget || budget.id == data.account.activeBudget ? 'bg-sky-100' : 'bg-white'}  hover:bg-slate-100`} type="button" onClick={() => {
            console.log("clicked!")
            setActiveBudget(budget.id)
          }}><span className="text-xl text-black">{budget.name}</span></button>
        })}

        <user.Form
          className="flex flex-wrap justify-center bg-sky-700 p-1"
          method="post"
          action="/user/update"
        >

          <input name="budgetId" defaultValue={activeBudget} hidden={true} />
          <button type="submit" className="w-full lg:w-40 rounded bg-gray-950 p-2 my-1 mx-1 text-white" disabled={activeBudget == ""}>Change Budget</button>
        </user.Form>


      </div>


      <budget.Form
        className="flex flex-wrap justify-center bg-sky-700 p-1"
        method="post"
        action="/budget/new"
      >

        <input className="bg-white" name="name" placeholder="Budget Name" />
        <button type="submit" className="w-full lg:w-40 rounded bg-gray-950 p-2 my-1 mx-1 text-white">Add Budget</button>
      </budget.Form>

    </main>
  )
}
