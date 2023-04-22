import { Link } from "@remix-run/react";

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
import { requireUserId, } from "~/session.server";

import { useOptionalUser } from "~/utils";

import NewTransactionPage from "../../components/transactions/new";
import { getCategories } from "~/models/category.server";
import { Decimal } from "@prisma/client/runtime";

import {
  generateOutflowTransactionCategories
} from "~/models/transaction.server";


export async function loader({ request, params }: LoaderArgs) {
  
  const userId = await requireUserId(request);
 // const categories = await getCategories({ userId });
 const outflowCategories = await generateOutflowTransactionCategories({userId})
  return json({ userId, outflowCategories});
}

export default function Budget() {
  const user = useOptionalUser()
  const data = useLoaderData<typeof loader>();

  const nameRef = React.useRef<HTMLInputElement>(null);
  const maxValueRef = React.useRef<HTMLInputElement>(null);
  const dueRef = React.useRef<HTMLInputElement>(null);
  const frequencyRef = React.useRef<HTMLInputElement>(null);

  const actionData = useActionData();
  const errors = actionData?.errors;
  const category = useFetcher();

  return (
    <div className="w-full bg-slate-200">

      {data.outflowCategories?.map((c) => {
        return <div>
          {JSON.stringify(c)}
        </div>
      })}

      {user?.email}
      <category.Form method="post" action="/category/new">
        <input ref={nameRef} name="name" placeholder="Name" />
        <input ref={maxValueRef} name="maxValue" placeholder="Amount" />

        <input ref={dueRef} name="due" placeholder="Due On" />

        <input ref={frequencyRef} name="frequency" placeholder="Frequency" />

        <button type="submit">Add Category</button>
      </category.Form>



   
    </div>
  );
}


// {data.categories?.map((c) => {
//   return (
//     <div
//       className={`border-bottom my-0.5 flex flex-col border-slate-300 px-3 py-0.5 hover:bg-slate-100`}
//       key={c.id}
//     >
//       <div className="flex justify-between">
//         <div>
//           <span className="text-s font-bold text-slate-800">
//             {c.name || "-"}
//           </span>
//           <span className="text-s m-left-4 text-slate-800">
//             Needed: {c.maxValue || "-"}
//           </span>
//         </div>

//         <span className={`text-black`}>{Number(c.currentValue)}</span>
//       </div>

//       <div className="flex justify-between">
//         <span className="text-xs text-slate-800">
//           Due: {new Date(c.due).toISOString().slice(0, 10)}
//         </span>
//         <category.Form method="post" action="/category/delete">
//           <input name="id" defaultValue={c.id} type="hidden" />
//           <button type="submit">X</button>
//         </category.Form>
//       </div>

//       {/* <p>CurrentValue: {c.currentValue}</p>
//                       <p>MaxValue: {c.maxValue}</p>
//                       <p>Spent: {c.spent}</p>
//                       <p>Due: {c.due}</p>
//                       <p>Frequency: {c.frequency}</p> */}
//     </div>
//   );
// })}


