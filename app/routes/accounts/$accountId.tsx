import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
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

// import { TransactionContainer } from "../../../theme/components/Core"
// import { TransactionContainer } from "theme/components/Core";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  // invariant(params.accountId, "Account not found");

  const account = await getAccount({ userId, id: params.accountId });
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

  return json({ userId, account, transactions, categories });
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

  const [uncategorized, setUncategorized] = React.useState(false);



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
    //  event.preventDefault();
    console.log("handleFormSubmit called!")
    doReconcile(false);
    setActiveTransaction("");
    setUpdateAccount(false);
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

  return (
    <section className="flex w-full flex-col">
      {!updateAccount && <h3>{data.account.name}</h3>}

      <button onClick={() => doReconcile(true)}>Reconcile</button>
      <button onClick={() => setUpdateAccount(true)} type="button">
        Account Settings
      </button>

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

      <h3>Transactions length: {data.transactions.length}</h3>

      
      {/* <transaction.Form
        className=" flex flex-wrap justify-center bg-sky-500 p-1"
        method="post"
        action="/transaction/new"
      >
        <input name="accountId" defaultValue={data.account.id} type="hidden" />
        <input
          ref={dateRef}
          name="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          placeholder="Date"
          className="m-1"
        />

        {transaction.data?.errors.date}

        <input
          ref={payeeRef}
          name="payee"
          placeholder="Payee"
          className="m-1"
        />

        {uncategorized ? (
          <>
            <span>Inflow: Uncategorized</span>
          </>
        ) : (
          <select name="category">
            {
              data.categories?.map((c) => {
                return <option value={c.id} key={c.id}>{c.name}</option>
              })
            }
          </select>
        )}

        <input ref={memoRef} name="memo" placeholder="Memo" className="m-1" />

        <input ref={inRef} onChange={() => handleInputChange()} name="inflow" placeholder="In" className="m-1" />

        <input ref={outRef} onChange={() => handleInputChange()} name="outflow" placeholder="Out" className="m-1" />

        <button type="submit" className="rounded bg-sky-800 p-2 text-white">
          Add Transaction
        </button>
      </transaction.Form> */}

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
