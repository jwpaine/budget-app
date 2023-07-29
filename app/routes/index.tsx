import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

// import {Button} from "../components/Button"

import { getUserId } from "~/auth.server";

import CategoryDemo from "~/components/categoryDemo";
import AccountDemo from "~/components/accountDemo";
import { Link } from "@remix-run/react";


export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/budget");

  return json({});
}


export default function Index() {
  // const user = useOptionalUser();
  return (
    <main className="flex flex-col bg-gray-950 w-full h-full items-center">
      <section className="flex flex-col lg:flex-row justify-center content-center items-center lg:items-start w-full max-w-6xl p-10">

        <div className="w-full">
          <h1 className="text-5xl md:text-7xl text-white font-bold">Budgeting</h1>
          <h1 className="text-6xl md:text-8xl text-white font-bold">Made</h1>
          <h1 className="text-7xl md:text-9xl text-emerald-400 font-bold">Simple</h1>
          <p className="text-sky-100 text-2xl py-5 text-center lg:text-left">
            Manage your spending, save towards goals, and pay off debt. <br /> It all starts with a budget.
          </p>

        </div>




      </section>
      <section className="bg-gray-900 p-10 w-full max-w-6xl rounded">

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full ">

          <div className="flex flex-col ">
            <p className="text-sky-100 text-xl lg:max-w-xl text-center lg:text-left lg:pr-12">
              We make it <span className="font-bold ">easy</span> to track monthly expenses, and budget for the road ahead. <br /> <br /> Whether you
              want to save money for a dream vacation, pay off debt, or build an emergency fund, DollarGrad can help.
            </p>

            <Link to="/budget">
              <button className="bg-emerald-400 hover:bg-emerald-500 text-gray-800 text-xl font-bold py-4 px-6 rounded mt-10">
                Get Started
              </button>
            </Link>
          </div>

          <CategoryDemo />

        </div>

      </section>
      <section className="bg-white p-10 w-full max-w-6xl rounded mt-5">


        <p className="text-gray-900 text-sky-100 text-xl lg:max-w-xl text-center lg:text-left lg:pr-12">
          We make it easy for you to track your monthly expenses, and budget for the road ahead. <br /> <br /> Whether you
          want to save money for a dream vacation, pay off debt, or build an emergency fund, DollarGrad can help.
        </p>



      </section>
    </main>
  );
}
