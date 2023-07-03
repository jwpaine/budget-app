import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Link, useMatches, NavLink } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import Select from "react-virtualized-select";

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

// import { TransactionContainer } from "../../../theme/components/Core"
// import { TransactionContainer } from "theme/components/Core";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  // invariant(params.accountId, "Account not found");

  const account = await getAccount({ userId, id: params.accountId });
  const accounts = await getAccounts({ userId });

  if (!account) {
    return redirect("/accounts");
  }

  const categories = await getCategoryNames({ userId })

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
      <div>
        <h3>Reconcile {data.account.name}</h3>
        <h3>Current Balance {data.account.balance}</h3>

        <transaction.Form
          className="flex flex-wrap"
          method="post"
          action="/transaction/new"
          onSubmit={handleFormSubmit}
        >
          <input
            name="accountId"
            defaultValue={data.account.id}
            type="hidden"
          />

          <h3>New balance: </h3>

          <input
            ref={recRef}
            name="reconcile"
            defaultValue={data.account.balance}
            onChange={handleReconcileChange}
          />

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

          <button type="submit"> Reconcile </button>
        </transaction.Form>

        <button onClick={() => doReconcile(false)}>Cancel</button>
      </div>
    );
  }

  if (doTransfer) {
    return (
      <section>
        <h3>Transfer</h3>

        <transaction.Form
          className="flex flex-col"
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

          {/* <Select options={renderTransferableAccounts()} /> */}
          <select name="fromId">
            {
              data.accounts.map((a) => {
                return <option selected={a.id == data.account.id} key={a.id} value={a.id}> {`From: ${a.name} (${a.balance})`}</option>
              })
            }
          </select>

          <select name="toId">
            {
              data.accounts.map((a) => {
                return <option key={a.id} value={a.id}> {`To: ${a.name} (${a.balance})`}</option>
              })
            }
          </select>


          <input
            name="value"
            placeholder="Amount"
            className="m-1"
          />

          <input
            name="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            placeholder="Date"
            className="m-1"
          />




          <button type="submit"> Transfer </button>
          <button type="button" onClick={() => setDoTransfer(false)}> Cancel </button>
        </transaction.Form>

      </section>
    )
  }

  return (

    <main className="flex flex-col md:flex-row">

      <SideBar accounts={data.accounts} />

      <section className="flex w-full flex-col">

        <header className="flex flex-col">

          <h3>{data.account.name}</h3>
          <button onClick={() => doReconcile(true)} type="button">Reconcile</button>
          <button onClick={() => setUpdateAccount(true)} type="button">Settings</button>
          <button onClick={() => setDoTransfer(true)} type="button">Transfer</button>

          <h3>Transactions length: {data.transactions.length}</h3>

        </header>

        {updateAccount && (
          <div>
            <account.Form
              method="post"
              action="/accounts/update"
              onSubmit={handleFormSubmit}
            >
              <input
                name="accountId"
                defaultValue={data.account.id}
                type="hidden"
              />
              <input name="name" defaultValue={data.account.name} />
              <select name="type">
                <option value="checking" selected={data.account.type == "checking"} >Checking</option>
                <option value="savings" selected={data.account.type == "savings"}>Savings</option>
                <option value="cash" selected={data.account.type == "cash"}>Cash</option>
                <option value="loan" selected={data.account.type == "loan"}>Loan / Credit Card</option>
              </select>
              <button type="submit" className="bg-sky-600">
                Update
              </button>
            </account.Form>

            {validateDelete ? (
              <account.Form method="post" action="/accounts/delete">
                <input
                  name="accountId"
                  defaultValue={data.account.id}
                  type="hidden"
                />
                <button type="submit" className="bg-red-600">
                  Yes, delete account
                </button>
                <button
                  type="button"
                  className="bg-sky-500"
                  onClick={() => setValidateDelete(false)}
                >
                  Cancel
                </button>
              </account.Form>
            ) : (
              <button
                type="button"
                className="bg-red-500"
                onClick={() => setValidateDelete(true)}
              >
                Delete account
              </button>
            )}

            <button onClick={() => setUpdateAccount(false)} type="button">
              Cancel
            </button>
          </div>
        )}


        <Transaction
          new
          accountId={data.account.id}
          onSubmit={handleFormSubmit}
          categories={data.categories}

        />

        {data.transactions?.map((t) => {
          return <Transaction onClick={() => {
            setActiveTransaction(t.id)
          }}
            active={t.id == activeTransaction}
            accountId={data.account.id}
            transaction={t}
            onSubmit={handleFormSubmit}
            categories={data.categories}

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
