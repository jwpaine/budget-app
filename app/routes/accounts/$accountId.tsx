import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import {
  Form,
  useCatch,
  useLoaderData,
  useActionData,
  useFetcher,
  useMatches,
} from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";


import { getAccount, getAccounts } from "~/models/account.server";
import { requireUserId } from "~/auth.server";
import { getCategoryNames } from "~/models/category.server";
import NewTransactionPage from "../../components/transactions/new";

import {
  createTransaction,
  getTransactions,
  deleteTransaction,
} from "~/models/transaction.server";
import { Decimal } from "@prisma/client/runtime";

import Transaction from "../../components/Transaction"
import SideBar from "../../components/accounts/sidebar"
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getUserById } from "~/models/user.server";

// import { TransactionContainer } from "../../../theme/components/Core"
// import { TransactionContainer } from "theme/components/Core";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  // invariant(params.accountId, "Account not found");

  const account = await getAccount({ userId, id: params.accountId });

  
  const user = await getUserById({id: userId, budgets: true, customer: true})

  const budgetId = user?.activeBudget

  if (!account || !budgetId) {
    return redirect("/budget");
  }

 

  console.log("using budgetId: ", budgetId)

  const accounts = await getAccounts({ userId, budgetId });

  console.log("obtained accounts: ", accounts)


  const categories = await getCategoryNames({ userId, budgetId })

  const transactions = await getTransactions({
    userId,
    accountId: params.accountId,
  });

  if (!account) {
    return redirect("/accounts");
  }

  return json({ userId, account, accounts, transactions, categories });
}



export const useRouteData = (routeId: string) => {
  const matches = useMatches()
  const data = matches.find((match) => match.id === routeId)?.data

  return data || undefined
}



export default function AccountDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const dateRef = React.useRef<HTMLInputElement>(null);
  const payeeRef = React.useRef<HTMLInputElement>(null);

  const memoRef = React.useRef<HTMLInputElement>(null);

  const inRef = React.useRef<HTMLInputElement>(null);
  const outRef = React.useRef<HTMLInputElement>(null);



  const recRef = React.useRef<HTMLInputElement>(null);

  const actionData = useActionData();
  const errors = actionData?.errors;
  const transaction = useFetcher();
  const account = useFetcher();

  const [reconcile, doReconcile] = React.useState(false);
  const [reconcileV, setReconcileV] = React.useState(data.account.balance);

  const [activeTransaction, setActiveTransaction] = React.useState("");
  const [updateAccount, setUpdateAccount] = React.useState(false);
  const [validateDelete, setValidateDelete] = React.useState(false);

  const [doTransfer, setDoTransfer] = React.useState(false)

  const [uncategorized, setUncategorized] = React.useState(false);

  const [sortBy, setSortBy ] = React.useState({"filter" : "", "value" : ""});

  const accountsData = useRouteData("routes/accounts")


  // const renderTransferableAccounts = () => {
  //   let accounts = accountsData.accounts

  //   console.log("Accounts", accounts)
  //   if (!accounts) return []

  //   return accounts.map((account) => {
  //     return {
  //       label: `${account.name}: ${account.value}`,
  //       value: account.id
  //     }
  //   })

  // }

  const graphTransactions = () => {
    console.log('graphing transactions')
    if (!data.transactions) {
      console.log('no transactions')
      return
    }

    let cash = Number(data.account.balance)
    let min = 999999 as number
    let max = 0 as number

    // data.accounts.map((account) => {
    //   if (account.type != 'loan') {
    //     //   console.log(`adding cash: ${account.balance}`)
    //     cash += Number(account.balance)
    //   }
    // });

    const graph_data = []

    graph_data.push({ name: 'today', cash: cash })

    data.transactions.map((t) => {
      // let sum = Number(t._sum.inflow) - Number(t._sum.outflow)
      let v = -Number(t.inflow) + Number(t.outflow)
      cash = cash + v

      // if (max < cash) max = cash
      // if (cash < min) min = cash

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
      <LineChart
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
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" stroke="#FFFFFF" />
        <YAxis type="number" stroke="#FFFFFF" domain={[0, max]} />
        <Tooltip />
        <Line type="monotone" dataKey="cash" stroke="#FFFFFF" strokeWidth={1} dot={false}/>
      </LineChart>
    </ResponsiveContainer>

  }


  const handleInputChange = () => {
    if (inRef.current) {
      const inflowValue = parseFloat(inRef.current.value);
      setUncategorized(inflowValue > 0);
    }
  };

  const handleReconcileChange = () => {
    const reconcileValue = parseFloat(recRef.current.value);
    const balance = parseFloat(data.account.balance);
    const diff = balance - reconcileValue;

    if (diff >= 0) {
      outRef.current.value = Math.abs(diff) || "";
      inRef.current.value = "";
    } else {
      inRef.current.value = Math.abs(diff) || "";
      outRef.current.value = "";
    }
  };

  const handleFormSubmit = (event) => {
    doReconcile(false);
    setActiveTransaction("");
    setUpdateAccount(false);
    setDoTransfer(false)
  };

  if (reconcile) {
    return (

      <main className="flex flex-col w-full items-center bg-gray-950 h-full">

        <transaction.Form
          method="post"
          action="/transaction/new"
          onSubmit={handleFormSubmit}
          className="flex flex-col w-full max-w-lg items-center justify-center p-5"
        >
          <h1 className="text-3xl text-white text-center">Reconcile {data.account.name}</h1>
          <span className="text-white text-center">Current Balance {data.account.balance}</span>

          <input
            name="accountId"
            defaultValue={data.account.id}
            type="hidden"
          />

          <div className="flex flex-col items-center my-5">
            <span className="text-white">New Balance</span>

            <input
              ref={recRef}
              name="reconcile"
              defaultValue={data.account.balance}
              onChange={handleReconcileChange}
              className="w-small"
            />
          </div>


          <input ref={inRef} name="inflow" placeholder="In" type="hidden" />

          <input ref={outRef} name="outflow" placeholder="Out" type="hidden" />

          <input
            ref={memoRef}
            name="memo"
            defaultValue="Reconciled"
            type="hidden"
          />

          <input
            ref={dateRef}
            name="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            type="hidden"
          />

          <button type="submit" className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 mx-1 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 ">Reconcile Account</button>
        </transaction.Form>
        <button type="button" className="text-white" onClick={() => doReconcile(false)}>Cancel</button>
      </main>
    );
  }

  if (doTransfer) {
    return (
      <main className="flex flex-col w-full items-center bg-gray-950 h-full">

        <h1 className="text-3xl text-white text-center">Account transfer</h1>

        <transaction.Form
          className="flex flex-col w-full max-w-xs items-center justify-center p-5"
          method="post"
          action="/transaction/new"
          onSubmit={handleFormSubmit}
        >

          <input
            name="accountId"
            defaultValue={data.account.id}
            type="hidden"
          />

          <input
            name="type"
            defaultValue="transfer"
            type="hidden"
          />


          <div className="flex flex-col w-full">
            <span className="text-white">From: </span>
            <select className="w-full" name="fromId">
              {
                data.accounts.map((a) => {
                  return <option selected={a.id == data.account.id} key={a.id} value={a.id}> {`${a.name} (${a.balance})`}</option>
                })
              }
            </select>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-white">To: </span>
            <select className="w-full" name="toId">
              {
                data.accounts.map((a) => {
                  return <option key={a.id} value={a.id}> {`${a.name} (${a.balance})`}</option>
                })
              }
            </select>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-white">Amount: </span>
            <input
              name="value"
              placeholder="Amount"
              className=""
            />
          </div>

          <div className="flex flex-col w-full">
            <span className="text-white">Date: </span>
            <input
              name="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              placeholder="Date"
              className=""
            />
          </div>
          <button type="submit" className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 mx-1 my-5 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 " >Transfer</button>
          <button className="text-white" type="button" onClick={() => setDoTransfer(false)}> Cancel </button>
        </transaction.Form>

      </main>
    )
  }

  if (updateAccount) {

    return (
      <main className="flex flex-col w-full items-center bg-gray-950 h-full">

        {validateDelete ? (
          <>

            <account.Form
              method="post"
              action="/accounts/delete"
              className="flex flex-col w-full max-w-xs items-center justify-center p-5">
              <h1 className="text-3xl text-white text-center">Confirm Delete: {data.account.name} </h1>

              <input
                name="accountId"
                defaultValue={data.account.id}
                type="hidden"
              />
              <button
                type="button"
                className="items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 mx-1 my-5 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 "
                onClick={() => setValidateDelete(false)}
              >
                No, Abort!
              </button>
              <button type="submit" className="items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-3 mx-1 my-5 text-base font-medium text-white shadow-sm hover:bg-red-400 ">
                Yes, delete account
              </button>

            </account.Form>
          </>
        ) : (
          <>
            <h1 className="text-3xl text-white text-center">{data.account.name} </h1>
            <h2 className="text-1xl text-white text-center">Settings</h2>

            <account.Form
              className="flex flex-col w-full max-w-xs items-center justify-center p-5"
              method="post"
              action="/accounts/update"
              onSubmit={handleFormSubmit}
            >
              <input
                name="accountId"
                defaultValue={data.account.id}
                type="hidden"
              />
              <div className="flex flex-col w-full">
                <span className="text-white">Account Name:</span>
                <input name="name" defaultValue={data.account.name} />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-white">Account Type: </span>
                <select name="type">
                  <option value="checking" selected={data.account.type == "Checking"} >Checking</option>
                  <option value="savings" selected={data.account.type == "Savings"}>Savings</option>
                  <option value="cash" selected={data.account.type == "Cash"}>Cash</option>
                  <option value="loan" selected={data.account.type == "Loan"}>Loan / Credit Card</option>
                </select>
              </div>
              <button type="submit" className="items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 mx-1 my-5 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 " >Update</button>
            </account.Form>

            <button onClick={() => setValidateDelete(true)} type="button" className="items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-3 mx-1 my-5 text-base font-medium text-white shadow-sm hover:bg-red-400 ">
              Delete Account
            </button>

            <button className="text-white" onClick={() => setUpdateAccount(false)} type="button">
              Cancel
            </button>
          </>
        )}
      </main >
    )
  }

  return (

    <main className="flex h-full flex-col bg-gray-950 md:flex-row">

      <SideBar accounts={data.accounts} />

      <section className="flex w-full flex-col">

        <header className="bg-slate-900">
        <div className="flex h-200 m-5 ">
          {graphTransactions()}
        </div>
          <div className="flex h-200 m-2 ">
            <h1 className="text-white">{data.account.name}</h1>
          </div>

          <div className="flex h-200 m-2 ">
            <button className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-3 text-base font-medium shadow-sm hover:bg-slate-800 sm:px-8 mr-2" onClick={() => doReconcile(true)} type="button">Reconcile</button>
            <button className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-3 text-base font-medium shadow-sm hover:bg-slate-800 sm:px-8 mr-2" onClick={() => setDoTransfer(true)} type="button">Transfer</button>
            <button className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-3 text-base font-medium shadow-sm hover:bg-slate-800 sm:px-8 mr-2" onClick={() => setUpdateAccount(true)} type="button">Settings</button>
          </div>


          {/* <span className="text-white">Total transactions: {data.transactions?.length}</span> */}

        </header>

        <Transaction
          new
          accountId={data.account.id}
          onSubmit={handleFormSubmit}
          categories={data.categories}

        />
        {sortBy.filter != "" && <>
          <span className="text-white">Filtering by {sortBy.filter} : {sortBy.value}</span>
          <button className="text-white" onClick={() => setSortBy({"filter" : "", "value" : ""})}>Clear Filter</button>
        </>}
        {data.transactions?.map((t) => {
          if (sortBy.filter == 'category' && sortBy.value != t.category) return
          if (sortBy.filter == 'payee' && sortBy.value != t.payee ) return

          return <Transaction onClick={() => {
            setActiveTransaction(t.id)
          }}
            active={t.id == activeTransaction}
            accountId={data.account.id}
            transaction={t}
            onSubmit={handleFormSubmit}
            categories={data.categories}
           // sortBy={({filter, value} : {filter: string, value: string}) => setSortBy({"filter" : filter, "value" : value})}

          />
        })}
      </section>


    </main>


  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Account not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
