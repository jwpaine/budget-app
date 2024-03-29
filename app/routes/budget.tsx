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
import { requireUserId, trialExpired } from "~/auth.server";

import { useOptionalUser } from "~/utils";

import NewTransactionPage from "../components/transactions/new";
import { getCategories } from "../models/category.server";
import { getDailyTransactionSums, getTransactions, getUncategorizedTransactions } from "~/models/transaction.server";

// import Graph from "../../components/transactions/graph"

import { Decimal } from "@prisma/client/runtime";
import SideBar from "~/components/accounts/sidebar";
import { getUserById } from "~/models/user.server";
import { r } from "vitest/dist/types-94cfe4b4";
import { useInsights } from "~/InsightsContext";

// import {
//   generateTransactionCategories
// } from "~/models/transaction.server";

export const useRouteData = (routeId: string) => {
  const matches = useMatches()
  const data = matches.find((match) => match.id === routeId)?.data

  return data || undefined
}

export async function action({ request, params }: ActionArgs) {

  console.log("post request received")

  const formData = await request.formData();

  const userId = await requireUserId(request);

  // const budgetId = Number(formData.get("budgetId")) as number
  const budgetId = parseInt(formData.get("budgetId") as string, 10) as number;

  const startDate = formData.get("startDate") as string;

  const categories = await getCategories({ userId, budgetId, startDate });

  return json({ categories });

}

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);

  const account = await getUserById({ id: userId, budgets: true })

  // obtain account createdAt. If greater than two weeks and account.customer.subscription.status != 'active', than redirect to /account:
  if (await trialExpired({ account })) {
    return redirect("/account")
  }


  if (!account) return redirect("/logout")
  const budgetId = Number(account?.activeBudget) as number

  console.log("using budgetId: ", budgetId)

  // const currentDate = new Date();
  // currentDate.setDate(1);
  // const startDate = currentDate.toISOString().slice(0, 10);

  // const categories = await getCategories({ userId, budgetId, startDate });
  const accounts = await getAccounts({ userId, budgetId });

  // console.log("obtained accounts: ", accounts)

  return json({ account, userId, accounts });
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

  const categories = useFetcher()

  const [activeBudget, setActiveBudget] = React.useState("");
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [resolve, setResolve] = React.useState(0);

  // create react hook to toggle analytics on/off:
  const [showAnalytics, setShowAnalytics] = React.useState(false);

  const [budgetWindow, setBudgetWindow] = React.useState("");


  let insights = useInsights();




  // create async function called recordClick:
  const recordClick = async (name: string) => {
    // Track event only on the client side
    if (typeof window !== "undefined") {
      await insights.trackEvent({ name: name });
      // record username in insights if logged in:

    }
  };



  React.useEffect(() => {
    // Define an async function inside useEffect
    async function fetchData() {
      // Set date to the first day in the current month:
      const date = new Date() as Date

      date.setUTCMonth(date.getUTCMonth());
      date.setUTCDate(1); // Set the date to the first day of the month
      const newBudgetWindow = date.toISOString().slice(0, 10);
      setBudgetWindow(newBudgetWindow);

      const categories = await fetchCategories(newBudgetWindow);
      // categories.setData(categories);
    }

    // Call the async function
    fetchData();
  }, []);



  const advanceBudgetWindow = async () => {
    // advance date by one month:
    const date = new Date(budgetWindow) as Date;
    date.setUTCMonth(date.getUTCMonth() + 1);
    date.setUTCDate(1); // Set the date to the first day of the month
    const newBudgetWindow = date.toISOString().slice(0, 10);
    setBudgetWindow(newBudgetWindow);

    // Fetch categories for the new budget window
    fetchCategories(newBudgetWindow);
    //  data.categories.setData(categories);
  };

  const regressBudgetWindow = () => {
    // regress date by one month:
    const date = new Date(budgetWindow) as Date;
    date.setUTCMonth(date.getUTCMonth() - 1);
    date.setUTCDate(1); // Set the date to the first day of the month
    const newBudgetWindow = date.toISOString().slice(0, 10);
    setBudgetWindow(newBudgetWindow);

    // Fetch categories for the new budget window
    fetchCategories(newBudgetWindow);
    //  categories.setData(categories);
  };


  const fetchCategories = async (startDate: string) => {
    console.log("getting categories!");

    const response = await categories.submit(
      {
        budgetId: data.account.activeBudget,
        startDate: startDate,
      },
      { method: "post", action: "/budget" }
    );


  }



  /*
              <button className="text-black bg-white" onClick={() => regressBudgetWindow()}>Previous Month</button>
           <span className="text-white">Current Window: {budgetWindow} </span>
           <button className="text-black bg-white" onClick={() => advanceBudgetWindow()}>Next Month</button>
           */



  // const graphTransactions = () => {
  //   console.log('graphing transactions')
  //   if (!data.transactions) {
  //     console.log('no transactions')
  //     return
  //   }

  //   let cash = 0 as number
  //   let min = 999999 as number
  //   let max = 0 as number

  //   data.accounts.map((account) => {
  //     if (account.type != 'loan') {
  //       //   console.log(`adding cash: ${account.balance}`)
  //       cash += Number(account.balance)
  //     }
  //   });

  //   const graph_data = []

  //   graph_data.push({ name: 'today', cash: cash })

  //   data.transactions.map((t) => {
  //     let sum = Number(t._sum.inflow) - Number(t._sum.outflow)
  //     cash = cash - sum
  //     cash = Number(cash.toFixed(2))

  //     if (max < cash) max = cash
  //     if (cash < min) min = cash

  //     let dataPoint = {
  //       name: new Date(t.date).toISOString().slice(0, 10),
  //       cash: cash
  //     }
  //     graph_data.push(dataPoint)
  //   })

  //   graph_data.reverse()

  //   console.log(`min: ${min}`)
  //   console.log(`max: ${max}`) // here

  //   return <ResponsiveContainer width="100%" height={100} >
  //     <AreaChart
  //       width={500}
  //       height={200}
  //       data={graph_data}
  //       syncId="anyId"
  //       margin={{
  //         top: 10,
  //         right: 30,
  //         left: 10,
  //         bottom: 0,
  //       }}
  //     >
  //       <CartesianGrid strokeDasharray="3 3" />
  //       <XAxis dataKey="name" stroke="#FFFFFF" />
  //       <YAxis type="number" stroke="#FFFFFF" domain={[0, max]} />
  //       <Tooltip />
  //       <Area type="monotone" dataKey="cash" fill="#b3e0fe" dot={false} />
  //     </AreaChart>
  //   </ResponsiveContainer>

  // }

  const renderCalendar = (step: number) => {
    let [year, month, day] = budgetWindow.split('-');
    let date = new Date(Number(year), Number(month) - step, Number(day));
    let monthString = date.toLocaleDateString('en-US', { month: 'long' });
    let yearString = date.toLocaleDateString('en-US', { year: 'numeric' });
    return { monthString, yearString }
  };


  const renderBudgetTotals = () => {


    let cash = 0 as number
    let dept = 0 as number
    let inflow = 0 as number
    let outflow = 0 as number
    let currentBalance = 0 as number
    let toBudget = 0 as number

    let assigned = 0;

    if (!data.accounts || data.accounts.length == 0) {
      return { cash, toBudget }
    }



    categories?.data?.categories?.map((cat: any) => {
      // let c = Number(cat.inflow) > 0 ? Number(cat.inflow) : Number(cat.currentValue);
      currentBalance += Number(cat.currentValue)
      inflow += Number(cat.inflow)
      outflow += Number(cat.outflow)

    });

    data.accounts.map((account) => {
      if (account.type != 'Loan') {
        //   console.log(`adding cash: ${account.balance}`)
        cash += Number(account.balance)
      } else {
        //    console.log(`adding dept: ${account.balance}`)
        dept += Number(account.balance)
      }


    });

    // set cash to two decimal places:
    cash = Math.round(cash * 1e2) / 1e2
    toBudget = Math.round((cash - currentBalance + outflow - inflow) * 1e2) / 1e2
    return { cash, toBudget }
  }

  const generateColumnSums = () => {
    let budgeted = 0
    let balance = 0
    let spent = 0
    let needed = 0

    categories?.data?.categories?.map((c: any) => {

      budgeted += Number(c.currentValue)
      balance += Number(c.inflow) - Number(c.outflow) + Number(c.currentValue)
      spent += Number(c.inflow) - Number(c.outflow)
      needed += Number(c.needed)
    })

    return {
      budgeted: Math.round(budgeted * 1e2) / 1e2,
      balance: Math.round(balance * 1e2) / 1e2,
      spent: Math.round(spent * 1e2) / 1e2,
      needed: Math.round(needed * 1e2) / 1e2
    }

  }


  return (
    <main className="flex flex-col md:flex-row">

      <SideBar accounts={data.accounts} />

      <section className="flex w-full flex-col">
        <header className="bg-black">

          {/* <div className="flex h-200 w-full justify-between p-2"> */}
          <div className="h-200 w-full p-2 grid grid-cols-3">

            <button className="text-slate-300 p-2" onClick={() => regressBudgetWindow()}> {renderCalendar(2).monthString}</button>

            <div className="flex flex-col">
              <span className="text-white text-2xl text-center"> {renderCalendar(1).monthString}</span>
              <span className="text-white text-center"> {renderCalendar(1).yearString}</span>
            </div>

            <button className="text-slate-300  p-2" onClick={() => advanceBudgetWindow()}> {renderCalendar(0).monthString}</button>
          </div>


          <div className="flex h-200 p-2 justify-between lg:justify-center items-center w-full">

            <span className="text-white text-xl mr-2">
              To Be Budgeted:
            </span>
            <span className={`bg-slate-800 rounded p-2 text-xl ${renderBudgetTotals().toBudget > 0 ? 'text-emerald-400' : renderBudgetTotals().toBudget < 0 ? 'text-red-400' : 'text-white'}`}>${renderBudgetTotals().toBudget}</span>



          </div>

          {/* <div className="flex h-200 m-2 p-2">
            <p className="text-white">Current Budget: {
              data.account?.budgets.map((budget) => {
                if (budget.id == data.account?.activeBudget) return budget.name
              })
            }</p>
          </div> */}




          <div className={`border-bottom my-0.5 flex flex-col px-3 py-0.5 bg-slate-300`}>
            <div className="flex justify-between">
              <div className="flex flex-col w-40">
                <span className="text-sm lg:text-base font-bold">
                  Category
                </span>
                <span className="text-xs text-slate-800">
                  Needed By Date
                </span>
              </div>
              <div className={`grid grid-cols-4 w-full max-w-xl `}>
                <div className={`flex flex-col justify-center text-right items-end mr-2`}>
                  <span className="text-sm lg:text-base font-bold">Budgeted</span>
                  <span className="text-slate-800 rounded max-w-fit">{generateColumnSums().budgeted}</span>
                </div>
                <div className={`flex flex-col justify-center text-right items-end`}>
                  <span className="text-sm lg:text-base font-bold">Activity</span>
                  <span className="text-slate-800 rounded max-w-fit">{generateColumnSums().spent}</span>
                </div>
                <div className={`flex flex-col justify-center text-right items-end`}>
                  <span className="text-sm lg:text-base font-bold">Balance</span>
                  <span className="text-slate-800 rounded max-w-fit">{generateColumnSums().balance}</span>
                </div>
                <div className={`flex flex-col justify-center text-right items-end`}>
                  <span className="text-sm lg:text-base font-bold">Needed</span>
                  <span className="text-slate-800 rounded max-w-fit">{generateColumnSums().needed}</span>
                </div>
              </div>
            </div>

          </div>

        </header>

        {
          categories?.data?.categories?.map((c: any) => {
            let budgeted = Number(c.currentValue).toFixed(2)
            let balance = (Number(c.inflow) - Number(c.outflow) + Number(c.currentValue)).toFixed(2)
            let activity = (Number(c.inflow) - Number(c.outflow)).toFixed(2)
            let needed = Number(c.needed)

            return activeBudget == c.id ? (
              confirmDelete ?
                <categories.Form
                  className="flex flex-col justify-center items-center bg-gray-600 p-1"
                  method="post"
                  action="/category/delete"
                  onSubmit={() => {
                    setActiveBudget("")
                    setConfirmDelete(false)
                    recordClick(`Delete Category: ${c.category}`)
                  }
                  }>
                  <h3 className="text-white text-center text-xl">Remove category {c.category}?</h3>
                  <input name="id" defaultValue={c.id} type="hidden" />
                  <input
                    name="window"
                    defaultValue={budgetWindow}
                    hidden />
                  <input
                    name="budgetId"
                    defaultValue={data?.account?.activeBudget || ""}
                    hidden />
                  <div className="flex w-full lg:max-w-xs p-2">
                    <button
                      type="submit"
                      className="bg-red-400 px-2 py-1 text-slate-800 flex-1 mr-2"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      className="bg-emerald-400 px-2 py-1 text-slate-800 flex-1"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </categories.Form>
                :
                <div className="flex flex-col justify-center items-center bg-gray-600">
                  <div className="flex w-full p-2 justify-between bg-gray-700">
                    {!c.linked ? <button
                      type="button"
                      className="rounded bg-red-400 p-2 text-white"
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete
                    </button> : <span className="text-white">Payment Category: {c.category}</span>}
                    <div className="flex items-center h-full">
                      <span className="text-white font-bold">Activity: </span>
                      <span className="mx-2 text-right text-white">{activity}</span>
                      <span className="text-white font-bold" >Balance: </span>
                      <span className={`mx-2 text-right ${Number(balance) == 0 && 'text-white'} ${Number(balance) < 0 && 'text-red-500 font-bold'} ${Number(balance) > 0 && 'text-emerald-300 font-bold '}`}>{balance}</span>


                      
                      {/* <span className={`bg-slate-800 rounded p-2 text-xl ${renderBudgetTotals().toBudget > 0 ? 'text-emerald-400' : renderBudgetTotals().toBudget < 0 ? 'text-red-400' : 'text-white'}`}>${renderBudgetTotals().toBudget}</span> */}

                      {renderBudgetTotals().toBudget != 0 && (
                        
                        <categories.Form
                          className="h-full"
                          method="post"
                          action="/category/update"
                          onSubmit={() => {
                            setActiveBudget("")
                            recordClick(`Borrow Category: ${c.category}`)
                          }}
                        >
                          <input
                            name="action"
                            defaultValue="setBudget"
                            type="hidden"
                          />

                          <input
                            name="budgetId"
                            defaultValue={data?.account?.activeBudget}
                            type="hidden"
                          />

                          <input
                            name="id"
                            defaultValue={c.id}
                            type="hidden"
                          />

                          <input
                            name="window"
                            defaultValue={budgetWindow}
                            type="hidden"
                          />

                          <input
                            name="currentValue"
                            defaultValue={Number(Number(budgeted) + renderBudgetTotals().toBudget).toFixed(2)}
                            type="hidden"

                          />

                          <button
                            type="submit"
                            className={`rounded ${renderBudgetTotals().toBudget > 0 ? 'bg-emerald-400' : 'bg-red-300'} p-2 text-black`}
                          >
                            {renderBudgetTotals().toBudget > 0 && '+'}{renderBudgetTotals().toBudget}
                          </button>
                        </categories.Form>
                      )}
                      

                      {Number(balance) < 0 && (
                        <categories.Form
                          className="h-full"
                          method="post"
                          action="/category/update"
                          onSubmit={() => {
                            setActiveBudget("")
                            recordClick(`Resolve Category: ${c.category}`)
                          }}
                        >
                          <input
                            name="action"
                            defaultValue="setBudget"
                            type="hidden"
                          />

                          <input
                            name="budgetId"
                            defaultValue={data?.account?.activeBudget}
                            type="hidden"
                          />

                          <input
                            name="id"
                            defaultValue={c.id}
                            type="hidden"
                          />

                          <input
                            name="window"
                            defaultValue={budgetWindow}
                            type="hidden"
                          />

                          <input
                            name="currentValue"
                            defaultValue={Number(Number(budgeted) + Math.abs(Number(balance))).toFixed(2)}
                            type="hidden"

                          />

                          <button
                            type="submit"
                            className="rounded bg-emerald-400 p-2 text-black"
                          >
                            Resolve
                          </button>
                        </categories.Form>
                      )}



                    </div>
                  </div>
                  <categories.Form
                    className="flex flex-col p-2"
                    method="post"
                    action="/category/update"
                    onSubmit={() => {
                      setActiveBudget("")
                      recordClick(`Update Category: ${c.category}`)
                    }}
                  >
                    <div className="lg:flex lg:flex-wrap grid grid-cols-2 gap-2 w-full justify-center">
                      <input
                        name="id"
                        defaultValue={c.id}
                        type="hidden"
                      />



                      <input
                        name="window"
                        defaultValue={budgetWindow}
                        type="hidden"
                      />

                      <input
                        name="budgetId"
                        defaultValue={data.account.activeBudget}
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
                          defaultValue={c.due ? new Date(c.due).toISOString().slice(0, 10) : ""}
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
                          type="number"
                          step="0.01"
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
                      Close
                    </button>




                  </categories.Form>




                </div>

            ) : (
              // ${Number(c.inflow) - Number(c.outflow) + Number(c.currentValue) == 0 && "border border"}
              // ${Number(c.inflow) - Number(c.outflow) + Number(c.currentValue) > 0 && "border border-emerald-300"}
              // ${Number(c.inflow) - Number(c.outflow) + Number(c.currentValue) < 0 && "border border-rose-300"}
              <div
                onClick={() => {
                  setConfirmDelete(false)
                  setActiveBudget(c.id)
                 recordClick(`Category clicked: ${c.category}`)
                }}
                className={`flex justify-between px-3 bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700
                  
                  
                  `}
                key={c.id}
              >

                <div className="flex flex-col w-40">
                  <span className={`text-white text-m font-bold ${!c.due && 'py-2'}`}>
                    {c.category || "-"}
                  </span>
                  {c.due && <span className="text-xs text-white">
                    {new Date(c.due).toISOString().slice(0, 10)}
                  </span>}
                </div>
                <div className={`grid grid-cols-4 gap-4 w-full max-w-xl `}>


                  <span className={`flex flex-col justify-center text-right text-white`}>{budgeted}</span>
                  <span className={`flex flex-col justify-center text-right text-white`}>{activity}</span>
                  <span className={`
                    flex flex-col justify-center text-right 
                    ${Number(balance) == 0 && 'text-white'} 
                    ${Number(balance) < 0 && 'text-red-500 font-bold '} 
                    ${Number(balance) > 0 && Number(balance) >= Number(needed) && 'text-emerald-300 font-bold '} 
                    ${Number(balance) > 0 && Number(balance) < Number(needed) && 'text-orange-300 font-bold '}
                  `}>{balance}</span>
                  <span className={`flex flex-col justify-center text-right text-white`}>{needed}</span>


                </div>


              </div>

            )
          })
        }




        <categories.Form
          className={`mb-0.5 flex p-2 bg-gray-800 `}
          method="post" action="/category/new"
          onSubmit={() => { recordClick(`Added new category`) }}
          >

          <input className={`rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none `} ref={nameRef} name="name" placeholder="Category Name" />
          <input
            name="window"
            defaultValue={budgetWindow}
            hidden />
          <input
            name="budgetId"
            defaultValue={data?.account?.activeBudget || ""}
            hidden />
          <button className="flex items-center justify-center rounded-md border border-transparent bg-gray-950 ml-2 px-2 py-1 text-base text-white shadow-sm hover:bg-slate-950 sm:px-8"
            type="submit"
          >Add Category</button>
        </categories.Form>


      </section>

    </main >


  );
}





