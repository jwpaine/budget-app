import { Link, useMatches } from "@remix-run/react";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
  Form,
  useCatch,
  useLoaderData,
  useActionData,
  useFetcher,
} from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccount } from "~/models/account.server";
import { requireUserId, } from "~/auth.server";

import { useOptionalUser } from "~/utils";

import NewTransactionPage from "../../components/transactions/new";
import { getCategories } from "~/models/category.server";
import { getDailyTransactionSums, getTransactions, getUncategorizedTransactions } from "~/models/transaction.server";

// import Graph from "../../components/transactions/graph"

import { Decimal } from "@prisma/client/runtime";

// import {
//   generateTransactionCategories
// } from "~/models/transaction.server";

export const useRouteData = (routeId: string) => {
  const matches = useMatches()
  const data = matches.find((match) => match.id === routeId)?.data

  return data || undefined
}

export async function loader({ request, params }: LoaderArgs) {

  const userId = await requireUserId(request);
  const categories = await getCategories({ userId });


  let currentDate = new Date() as Date
  currentDate.setDate(currentDate.getDate() - 30);
  let startDate = new Date(currentDate.toISOString().slice(0, 10)) as Date

  const accountId = ""

  const transactions = await getDailyTransactionSums({ userId, startDate, accountId })

  return json({ userId, categories, transactions });
}



export default function Budget() {
  const user = useOptionalUser()
  const data = useLoaderData<typeof loader>();
  const parentData = useRouteData("routes/accounts")

  const nameRef = React.useRef<HTMLInputElement>(null);
  const maxValueRef = React.useRef<HTMLInputElement>(null);
  const dueRef = React.useRef<HTMLInputElement>(null);
  const frequencyRef = React.useRef<HTMLInputElement>(null);

  const actionData = useActionData();
  const errors = actionData?.errors;
  const category = useFetcher();

  const [activeBudget, setActiveBudget] = React.useState("");
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [resolve, setResolve] = React.useState(0);

  const graphTransactions = () => {
    console.log('graphing transactions')
    if (!data.transactions) {
      console.log('no transactions')
      return
    }

    let cash = 0 as number

    parentData.accounts.map((account) => {
      if (account.type != 'loan') {
        //   console.log(`adding cash: ${account.balance}`)
        cash += Number(account.balance)
      }
    });

    const graph_data = []

    graph_data.push({ name: 'today', cash: cash })

    data.transactions.map((t) => {
      cash = cash - (Number(t._sum.inflow) - Number(t._sum.outflow))

      let dataPoint = {
        name: new Date(t.date).toISOString().slice(0, 10),
        cash: cash
      }
      graph_data.push(dataPoint)
    })

    graph_data.reverse()

    return <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        width={500}
        height={200}
        data={graph_data}
        syncId="anyId"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#FFFFFF"/>
        <YAxis stroke="#FFFFFF" />
        <Tooltip />
        <Area type="monotone" dataKey="cash" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>





  }


  const renderBudgetTotals = () => {
    if (!parentData.accounts || parentData.accounts.length == 0) return

    let cash = 0 as number
    let dept = 0 as number
    let inflow = 0 as number
    let outflow = 0 as number
    let currentBalance = 0 as number

    let assigned = 0;

    console.log("all category data: ", data.categories)


    data.categories?.map((cat) => {
      // let c = Number(cat.inflow) > 0 ? Number(cat.inflow) : Number(cat.currentValue);
      currentBalance += Number(cat.currentValue)
      inflow += Number(cat.inflow)
      outflow += Number(cat.outflow)

    });

    parentData.accounts.map((account) => {
      if (account.type != 'loan') {
        //   console.log(`adding cash: ${account.balance}`)
        cash += Number(account.balance)
      } else {
        //    console.log(`adding dept: ${account.balance}`)
        dept += Number(account.balance)
      }


    });


    return (
      <div>
        <div className="flex h-200">

          {graphTransactions()}
        </div>
        <span className="text-white">Cash: {cash.toFixed(2)}</span> <br />
        <span className="text-white">Inflow: {inflow.toFixed(2)}</span> <br />
        <span className="text-white">Outflow: {outflow.toFixed(2)}</span> <br />
        <span className="text-white">Budgeted: {currentBalance.toFixed(2)}</span> <br />
        <span className="text-white">to be budgeted: {(cash - currentBalance + outflow - inflow).toFixed(2)}</span>
        {/* <span className="text-white">to be budgeted: {(cash - currentBalance - outflow + inflow).toFixed(2)}</span> */}
        {/* 10710.87 - 11906.23 + 2259.98 - 144 */}
      </div>
    )
  }

  return (
    <section className="flex w-full flex-col">
      <header className="bg-sky-800">
        {user?.email}


        {renderBudgetTotals()}

        <div className={`border-bottom my-0.5 flex flex-col border-slate-200 px-3 py-0.5 bg-slate-300`}>
          <div className="flex justify-between">
            <div className="flex flex-col w-40">
              <span className="text-slac-800 text-s font-bold">
                Category
              </span>
              <span className="text-xs text-slate-800">
                Needed By Date
              </span>
            </div>
            <div className={`grid grid-cols-4 w-full max-w-xl `}>
              <span className={`flex flex-col justify-center text-right`}> Budgeted </span>
              <span className={`flex flex-col justify-center text-right`}> Activity </span>
              <span className={`flex flex-col justify-center text-right`}> Balance </span>
              <span className={`flex flex-col justify-center text-right`}> Needed </span>
            </div>
          </div>

        </div>

      </header>


      {
        data.categories?.map((c) => {
          let budgeted = Number(c.currentValue).toFixed(2)
          let balance = (Number(c.inflow) - Number(c.outflow) + Number(c.currentValue)).toFixed(2)
          let activity = (Number(c.inflow) - Number(c.outflow)).toFixed(2)
          let needed = Number(c.needed)

          return activeBudget == c.id ? (
            confirmDelete ?
              <category.Form
                className="flex flex-wrap justify-center bg-sky-700 p-1"
                method="post"
                action="/category/delete"
                onSubmit={() => {
                  setActiveBudget("")
                  setConfirmDelete(false)
                }
                }>
                <h3>Remove category {c.category}?</h3>
                <input name="id" defaultValue={c.id} type="hidden" />
                <button
                  type="submit"
                  className="bg-red-400 px-2 py-1 text-slate-800"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  className="bg-green-400 px-2 py-1 text-slate-800"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
              </category.Form>
              :
              <div>
                <category.Form
                  className="flex flex-wrap justify-center bg-sky-300 p-1"
                  method="post"
                  action="/category/update"
                  onSubmit={() => setActiveBudget("")}
                >
                  <input
                    name="id"
                    defaultValue={c.id}
                    type="hidden"
                  />

                  <input
                    name="name"
                    defaultValue={c.category}
                    placeholder="Category Name"
                    className="m-1"
                  />

                  <input

                    name="currentValue"
                    defaultValue={`${budgeted}`}
                    placeholder="Budgeted"
                    className="m-1"
                  />

                  <input
                    name="due"
                    defaultValue={new Date(c.due).toISOString().slice(0, 10)}
                    placeholder="Due Date"
                    className="m-1"
                  />

                  <input
                    name="needed"
                    defaultValue={needed}
                    placeholder="Needed"
                    className="m-1"
                  />

                  <button type="submit" className="rounded bg-sky-800 p-2 text-white">
                    Update Category
                  </button>
                  <button
                    type="button"
                    className="rounded bg-sky-800 p-2 text-white"
                    onClick={() => setActiveBudget("")}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded bg-sky-800 p-2 text-white"
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </button>

                </category.Form>

                {Number(balance) < 0 && (
                  <category.Form
                    className="flex flex-wrap justify-center bg-sky-300 p-1"
                    method="post"
                    action="/category/update"
                    onSubmit={() => setActiveBudget("")}
                  >
                    <input
                      name="action"
                      defaultValue="setBudget"
                      type="hidden"
                    />

                    <input
                      name="id"
                      defaultValue={c.id}
                      type="hidden"
                    />

                    <input
                      name="currentValue"
                      defaultValue={Number(Number(budgeted) + Math.abs(Number(balance))).toFixed(2)}
                      type="hidden"
                    />

                    <button
                      type="submit"
                      className="rounded bg-emerald-600 p-2 text-white"
                    >
                      Resolve
                    </button>
                  </category.Form>
                )}
              </div>

          ) : (
            <div>
              <div
                onClick={() => {
                  setConfirmDelete(false)
                  setActiveBudget(c.id)
                }}
                className={`mb-0.5 flex flex-col px-3 py-0.5 
                  ${Number(c.inflow) - Number(c.outflow) + Number(c.currentValue) == 0 && "bg-slate-200 hover:bg-slate-300"}                                                                                  
                  ${Number(c.inflow) - Number(c.outflow) + Number(c.currentValue) > 0 && "bg-emerald-200 hover:bg-emerald-300"} 
                  ${Number(c.inflow) - Number(c.outflow) + Number(c.currentValue) < 0 && "bg-rose-200 hover:bg-rose-300"} 
                  `}
                key={c.id}
              >
                <div className="flex justify-between">
                  <div className="flex flex-col w-40">
                    <span className="text-slac-800 text-s font-bold">
                      {c.category || "-"}
                    </span>
                    <span className="text-xs text-slate-800">
                      {new Date(c.due).toISOString().slice(0, 10)}
                    </span>
                  </div>
                  <div className={`grid grid-cols-4 gap-4 w-full max-w-xl `}>


                    <span className={`flex flex-col justify-center text-right`}>{budgeted}</span>
                    <span className={`flex flex-col justify-center text-right`}>{activity}</span>
                    <span className={`flex flex-col justify-center text-right`}>{balance}</span>

                    <span className={`flex flex-col justify-center text-right`}>{needed}</span>


                  </div>
                </div>

              </div>
            </div>
          )
        })
      }




      <category.Form
        className={`mb-0.5 flex p-5 bg-sky-700 `}
        method="post" action="/category/new">
        <input className={`p-2`} ref={nameRef} name="name" placeholder="Name" />
        <button className={`bg-white text-black text-center p-2 mx-2`} type="submit">Add Category</button>
      </category.Form>



    </section>













  );
}





