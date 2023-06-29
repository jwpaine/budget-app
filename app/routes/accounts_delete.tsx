import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/auth.server";
import { useUser } from "~/utils";
import { getAccounts } from "~/models/account.server";
import React, { useEffect } from "react";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
const accounts = await getAccounts({ userId });



  return json({ accounts });
}

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();

 
 //  const user = useUser();

  // let cash = 0;
  // let dept = 0;

  // data.accounts.map((account) => {
  //   let v = Number(account.balance);
  //   v > 0 ? (cash += v) : (dept += v);
  // });

  const [accountsBarOpen, setAccountsBarOpen] = React.useState(true);

  

  return (
    <>
      <main className="flex h-full flex-col md:flex-row">
        <section className={`w-full  border-r bg-sky-700 md:max-w-sm`}>

          {data.accounts.length === 0 ? (
            <p className="p-4">No accounts added</p>
          ) : (
            <>
              {data.accounts.map((account) => (
                <NavLink
                  key={account.id}
                  className={({ isActive }) =>
                    `align-between w-full block flex justify-between p-2 hover:bg-sky-700`
                  }
                  to={account.id}
                >
                  <span className="text-m text-white">{account.name}</span>
                  <span
                    className={`${
                      Number(account.balance) >= 0
                        ? "text-white"
                        : "rounded bg-gray-100 p-1 text-red-500"
                    } text-m`}
                  >
                    {account.balance}
                  </span>
                </NavLink>
              ))}
            </>
          )}

          <Link
            to="new"
            className="align-between flex justify-between p-2 text-xl text-white hover:bg-sky-700"
            // onClick={() => setAccountsBarOpen(false)}
          >
            + Add Account
          </Link>
        </section>

        <Outlet />
      </main>
    </>
  );
}
