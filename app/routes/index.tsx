import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

// import {Button} from "../components/Button"

import { getUserId } from "~/auth.server";

import CategoryDemo from "~/components/categoryDemo";
import AccountDemo from "~/components/accountDemo";


export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/budget");

  return json({});
}


export default function Index() {
  // const user = useOptionalUser();
  return (
    <main className="flex flex-col bg-gray-950 w-full h-full items-center">
      <section className="flex flex-col justify-center content-center items-center lg:items-start w-full max-w-6xl p-10">
       
          <h1 className="text-5xl md:text-7xl text-white font-bold">Budgeting</h1>
          <h1 className="text-6xl md:text-8xl text-white font-bold">Made</h1>
          <h1 className="text-7xl md:text-9xl text-emerald-400 font-bold">Simple</h1>
          <p className="text-sky-100 text-2xl py-5 text-center lg:text-left">
            Manage your spending, save towards goals, and pay off debt. <br /> It all starts with a budget.
          </p>
        

      </section>
      <section className="bg-gray-900 p-10 w-full max-w-6xl">

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full ">

          <p className="text-sky-100 text-xl lg:max-w-xl text-center lg:text-left lg:pr-12">
            We make it easy for you to track your monthly expenses, and budget for the road ahead. <br /> <br /> Whether you
            want to save money for a dream vacation, pay off debt, or build an emergency fund, DollarGrad can help.
          </p>

          <CategoryDemo />

        </div>

      </section>
    </main>
  );
}
