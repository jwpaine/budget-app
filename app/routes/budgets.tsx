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

  // add use effect that sets activeBudget to data.account.activeBudget:
  React.useEffect(() => {
    setActiveBudget(data.account.activeBudget)
  }, [data.account.activeBudget])

  return (
    <main className="flex flex-col w-full items-center bg-gray-950 h-full">

      <h1 className="text-3xl text-white">My Budgets</h1>

      <div className="flex flex-wrap my-10">
        {data.account.budgets?.map((budget) => {
          return <button key={budget.id} className={`rounded flex-1 min-h-500 w-100 p-5 m-2 flex flex-col justify-center items-center  ${budget.id == activeBudget  ? 'bg-sky-100' : 'bg-white'}  hover:bg-slate-100`} type="button" onClick={() => {
            console.log("clicked!")
            setActiveBudget(budget.id)
          }}><span className="text-3xl text-black">{budget.name}</span>
            
            <span className="text-xl text-black">Created: {budget.createdAt.slice(0, 10)}</span>

          </button>
        })}

        </div>

        <user.Form
          className="flex flex-wrap justify-center p-1"
          method="post"
          action="/user/update"
        >

          <input name="budgetId" defaultValue={activeBudget} hidden={true} />
          <button type="submit" className={`text-xl rounded-md ${activeBudget == data.account.activeBudget ? 'bg-slate-300 hover:bg-slate-300' : 'bg-white'} px-4 py-3 mx-1 font-medium text-blue-700 hover:bg-blue-50 `}
               disabled={activeBudget == data.account.activeBudget}>Switch Budget</button>
        </user.Form>


    

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
