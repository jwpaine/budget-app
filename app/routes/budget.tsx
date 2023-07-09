import { Link, useMatches, NavLink } from "@remix-run/react";

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
import { getAccounts } from "~/models/account.server";
import { requireUserId, } from "~/auth.server";

import { useOptionalUser } from "~/utils";

import NewTransactionPage from "../components/transactions/new";
import { getCategories } from "~/models/category.server";
import { getDailyTransactionSums, getTransactions, getUncategorizedTransactions } from "~/models/transaction.server";

// import Graph from "../../components/transactions/graph"

import { Decimal } from "@prisma/client/runtime";
import SideBar from "~/components/accounts/sidebar";

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
  const accounts = await getAccounts({ userId });


  let currentDate = new Date() as Date
  currentDate.setDate(currentDate.getDate() - 30);
  let startDate = new Date(currentDate.toISOString().slice(0, 10)) as Date

  const accountId = ""
  const transactions = await getDailyTransactionSums({ userId, startDate, accountId })

  return json({ userId, categories, transactions, accounts });
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

  // create react hook to toggle analytics on/off:
  const [showAnalytics, setShowAnalytics] = React.useState(false);

  const graphTransactions = () => {
    console.log('graphing transactions')
    if (!data.transactions) {
      console.log('no transactions')
      return
    }

    let cash = 0 as number
    let min = 999999 as number
    let max = 0 as number

    data.accounts.map((account) => {
      if (account.type != 'loan') {
        //   console.log(`adding cash: ${account.balance}`)
        cash += Number(account.balance)
      }
    });

    const graph_data = []

    graph_data.push({ name: 'today', cash: cash })

    data.transactions.map((t) => {
      let sum = Number(t._sum.inflow) - Number(t._sum.outflow)
      cash = cash - sum
      cash = Number(cash.toFixed(2))

      if (max < cash) max = cash
      if (cash < min) min = cash

      let dataPoint = {
        name: new Date(t.date).toISOString().slice(0, 10),
        cash: cash
      }
      graph_data.push(dataPoint)
    })

    graph_data.reverse()

    console.log(`min: ${min}`)
    console.log(`max: ${max}`) // here

    return <ResponsiveContainer width="100%" height={100} >
      <AreaChart
        width={500}
        height={200}
        data={graph_data}
        syncId="anyId"
        margin={{
          top: 10,
          right: 30,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#FFFFFF" />
        <YAxis type="number" stroke="#FFFFFF" domain={[0, max]} />
        <Tooltip />
        <Area type="monotone" dataKey="cash" fill="#b3e0fe" />
      </AreaChart>
    </ResponsiveContainer>

  }


  const renderBudgetTotals = () => {
    if (!data.accounts || data.accounts.length == 0) {
      return (
        <div>

          <span className="text-white">Total cash: $0.00</span>
          <span className="text-white ml-5 mr-2">To be budgeted: $0.00</span>

        </div>
      )

    }

    let cash = 0 as number
    let dept = 0 as number
    let inflow = 0 as number
    let outflow = 0 as number
    let currentBalance = 0 as number

    let assigned = 0;

    // console.log("all category data: ", data.categories)


    data.categories?.map((cat: any) => {
      // let c = Number(cat.inflow) > 0 ? Number(cat.inflow) : Number(cat.currentValue);
      currentBalance += Number(cat.currentValue)
      inflow += Number(cat.inflow)
      outflow += Number(cat.outflow)

    });

    data.accounts.map((account) => {
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

        <span className="text-white">Total cash: ${cash.toFixed(2)}</span>
        {/* 
        <span className="text-white">Inflow: {inflow.toFixed(2)}</span> <br />
        <span className="text-white">Outflow: {outflow.toFixed(2)}</span> <br />
        <span className="text-white">Budgeted: {currentBalance.toFixed(2)}</span> <br /> */}
        <span className="text-white ml-5 mr-2">To be budgeted:</span>
        <span className={`${Number(cash - currentBalance + outflow - inflow) >= 0 ? "text-white" : "rounded bg-gray-100 p-1 text-red-500"} text-m`}>
          ${(cash - currentBalance + outflow - inflow).toFixed(2)}
        </span>


        {/* <span className="text-white">to be budgeted: {(cash - currentBalance - outflow + inflow).toFixed(2)}</span> */}
        {/* 10710.87 - 11906.23 + 2259.98 - 144 */}

      </div>
    )
  }

  if (showAnalytics) {
    return (
      <main className="flex flex-col md:flex-row ">

        {/* <SideBar accounts={data.accounts} /> */}

        <section className="flex w-full flex-col bg-slate-900">
          <div className="flex h-200 m-2 ">
            {renderBudgetTotals()}
          </div>
          <div className="flex h-200 m-2 ">
            {graphTransactions()}
          </div>
          <button onClick={() => setShowAnalytics(false)} className="rounded-md bg-blue-500 px-4  py-3 ml-2 font-small text-white hover:bg-blue-600 ">Close</button>
        </section>
      </main>
    )
  }

  return (
    <main className="flex h-full flex-col bg-gray-950 md:flex-row">

      <SideBar accounts={data.accounts} />

      <section className="flex w-full flex-col">
        <header className="bg-slate-800">
          {user?.email}

          <div className="flex h-200 m-2 ">

          </div>
          <div className="flex h-200 m-2 ">
            {renderBudgetTotals()}
          </div>
          <div className="flex h-200 m-2 ">
            <button onClick={() => setShowAnalytics(true)} className="rounded-md border border-solid hover:bg-slate-800 border-white px-4 py-3 ml-2 font-small text-white ">📊 View Stats</button>
          </div>

          <div className={`border-bottom my-0.5 flex flex-col px-3 py-0.5 bg-slate-300`}>
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
          data.categories?.map((c: any) => {
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
                <div className="flex flex-col justify-center items-center bg-gray-600">
                  <div className="flex w-full p-2 justify-between bg-gray-500">
                    <button
                      type="button"
                      className="rounded bg-red-400 p-2 text-white"
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete
                    </button>
                    <div>
                      <span className="text-white font-bold">Activity: </span>
                      <span className="mx-2 text-right text-white">{activity}</span>
                      <span className="text-white font-bold" >Balance: </span>
                      <span className={`mx-2 text-right ${Number(balance) == 0 && 'text-white'} ${Number(balance) < 0 && 'text-red-500 font-bold'} ${Number(balance) > 0 && 'text-emerald-300 font-bold '}`}>{balance}</span>
                    </div>
                  </div>
                  <category.Form
                    className="flex flex-col p-2"
                    method="post"
                    action="/category/update"
                    onSubmit={() => setActiveBudget("")}
                  >
                    <div className="lg:flex lg:flex-wrap grid grid-cols-2 gap-2 w-full justify-center">
                      <input
                        name="id"
                        defaultValue={c.id}
                        type="hidden"
                      />

                      <div className="flex flex-col">
                        <span className="text-white text-center">Category Name</span>
                        <input
                          name="name"
                          defaultValue={c.category}
                          placeholder="Category Name"
                          className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none "
                        />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-white text-center">Needed By Date</span>
                        <input
                          name="due"
                          defaultValue={new Date(c.due).toISOString().slice(0, 10)}
                          placeholder="Due Date"
                          className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none "
                        />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-white text-center">Budgeted</span>
                        <input

                          name="currentValue"
                          defaultValue={`${budgeted}`}
                          placeholder="Budgeted"
                          className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none "

                        />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-white text-center">Total Needed</span>
                        <input
                          name="needed"
                          defaultValue={needed}
                          placeholder="Needed"
                          className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none "
                        />

                      </div>

                    </div>










                    <button type="submit" className="rounded bg-gray-950 p-2 mt-4 text-white">
                      Update Category
                    </button>
                    <button
                      type="button"
                      className="rounded bg-slate-800 p-2 my-1 text-white"
                      onClick={() => setActiveBudget("")}
                    >
                      Cancel
                    </button>

                    {Number(balance) < 0 && (
                      <category.Form
                        className="w-full "
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
                          className="rounded w-full bg-emerald-500 p-2 my-1 text-black"
                        >
                          Resolve Negative Budget
                        </button>
                      </category.Form>
                    )}


                  </category.Form>


                </div>

            ) : (
              // ${Number(c.inflow) - Number(c.outflow) + Number(c.currentValue) == 0 && "border border"} 
              // ${Number(c.inflow) - Number(c.outflow) + Number(c.currentValue) > 0 && "border border-emerald-300"} 
              // ${Number(c.inflow) - Number(c.outflow) + Number(c.currentValue) < 0 && "border border-rose-300"} 
              <div
                onClick={() => {
                  setConfirmDelete(false)
                  setActiveBudget(c.id)
                }}
                className={` flex justify-between px-3 bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700
                  
                         
            
                  
                  `}
                key={c.id}
              >

                <div className="flex flex-col w-40">
                  <span className="text-white text-m font-bold">
                    {c.category || "-"}
                  </span>
                  <span className="text-xs text-white">
                    {new Date(c.due).toISOString().slice(0, 10)}
                  </span>
                </div>
                <div className={`grid grid-cols-4 gap-4 w-full max-w-xl `}>


                  <span className={`flex flex-col justify-center text-right text-white`}>{budgeted}</span>
                  <span className={`flex flex-col justify-center text-right text-white`}>{activity}</span>
                  <span className={`flex flex-col justify-center text-right ${Number(balance) == 0 && 'text-white'} ${Number(balance) < 0 && 'text-red-500 font-bold border-l-4 border-red-500'} ${Number(balance) > 0 && 'text-emerald-300 font-bold border-l-4 border-emerald-300'}`}>{balance}</span>
                  <span className={`flex flex-col justify-center text-right text-white`}>{needed}</span>


                </div>


              </div>

            )
          })
        }




        <category.Form
          className={`mb-0.5 flex p-2 bg-gray-800 `}
          method="post" action="/category/new">
          <input className={`rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none `} ref={nameRef} name="name" placeholder="Category Name" />
          <button className="flex items-center justify-center rounded-md border border-transparent bg-gray-950 ml-2 px-2 py-1 text-base text-white shadow-sm hover:bg-slate-950 sm:px-8"
            type="submit">Add Category</button>
        </category.Form>


      </section>

    </main>


  );
}





