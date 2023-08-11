import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

// import {Button} from "../components/Button"

import { getUserId, signupLink } from "~/auth.server";

import CategoryDemo from "~/components/categoryDemo";
import AccountDemo from "~/components/accountDemo";
import { Link, useLoaderData } from "@remix-run/react";


export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/budget");

  const signup_link = signupLink()

  return json({signupLink : signup_link});
}


export default function Index() {
  // const user = useOptionalUser();
  const data = useLoaderData();
  return (
    <main className="flex flex-col bg-gray-900 w-full items-center">
      <section className="flex flex-col justify-center content-center items-center lg:items-start w-full max-w-6xl p-10">

       
          <h1 className="text-5xl md:text-7xl text-white font-bold">Budgeting</h1>
          <h1 className="text-6xl md:text-8xl text-white font-bold">Made</h1>
          <h1 className="text-7xl md:text-9xl text-emerald-400 font-bold">Simple</h1>
          <p className="text-sky-100 text-2xl py-5 text-center lg:text-left">
            Manage your spending, save towards goals, and pay off debt. It all starts with a budget.
           
          </p>

     




      </section>
      <section className="bg-gray-800 p-10 w-full max-w-6xl rounded">

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full ">

          <div className="flex flex-col ">
            <p className="text-sky-100 text-xl lg:max-w-xl text-center lg:text-left lg:pr-12">
              We make it <span className="font-bold ">easy</span> to track monthly expenses, and budget for the road ahead. <br /> <br /> Whether you
              want to save money for a dream vacation, pay off debt, or build an emergency fund, DollarGrad can help.
             
            </p>
            <p className="text-sky-100 text-xl lg:max-w-xl text-center lg:text-left lg:pr-12 mt-10">
              Get started with a <span className="text-emerald-400">free 2 week trial</span> (no card required), and then only $5/month after that! Hello, budgeting!
            </p>

     

            <Link to={data.signupLink}>
              <button className="bg-emerald-400 hover:bg-emerald-500 text-gray-800 text-xl font-bold py-4 px-6 rounded mt-10 w-full lg:max-w-fit mb-10 lg:mb-0">
                Get Started
              </button>
            </Link>

           

          </div>

          <CategoryDemo />

        </div>

      </section>
      {/* <section className="flex flex-col content-center items-center justify-center bg-white p-10 w-full max-w-6xl rounded mt-5">

        <h1 className="text-black text-4xl text-center">Do you know where your money is going?</h1>

        <p className="text-black text-2xl lg:max-w-xl text-center lg:pr-12">
          The first step to taking control of your finances is knowing where your money is going. <br /> <br /> DollarGrad makes it easy to track your spending, and
          see where your money is going.
        </p>



      </section> */}
    </main>
  );
}
