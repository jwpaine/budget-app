import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

// import {Button} from "../components/Button"

import { getUserId, signupLink } from "~/auth.server";

import CategoryDemo from "~/components/categoryDemo";
import AccountDemo from "~/components/accountDemo";
import { Link, useLoaderData } from "@remix-run/react";

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';


import { useInsights } from '~/InsightsContext';

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/budget");

  const signup_link = signupLink()


  return json({ signupLink: signup_link });
}


export default function Index(props: { insights: ApplicationInsights }) {
  // const user = useOptionalUser();
  const data = useLoaderData();
  const insights = useInsights();


  // create async function called recordClick:
  const recordClick = async () => {
    // Track event only on the client side
    if (typeof window !== "undefined") {
      await insights.trackEvent({ name: 'Get Started Clicked (main)' });
    }
  };


  return (
    <main className="flex flex-col w-full items-center bg-gray-100">
      <div className="bg-gray-900 w-full flex flex-col items-center mb-10">
        <section className="flex flex-col lg:flex-row justify-center content-center items-center lg:items-start w-full max-w-6xl p-5 ">

          <div className="flex flex-col justify-center content-center items-center lg:items-start w-full ">
            <h1 className="text-5xl md:text-7xl text-white font-bold">Budgeting</h1>
            <h1 className="text-6xl md:text-8xl text-white font-bold py-2">Made</h1>
            <h1 className="text-7xl md:text-9xl text-emerald-400 font-bold">Simple</h1>
            <p className="text-sky-100 text-xl lg:text-2xl py-5 my-2 text-center lg:text-left">
              We make it <span className="font-bold ">easy</span> to build a flexible budget and see where your money is going!
            </p>
            <p className="text-sky-100 text-xl lg:text-2xl mb-5 text-center lg:text-left">
              Try <span className="font-bold ">FREE</span> for 365 days (No card required) when you signup now!
            </p>

          </div>
          <div className="flex flex-col justify-center content-center items-center w-full lg:mt-40">
            <Link to={data.signupLink} className="w-full lg:max-w-fit">
              <button className="bg-emerald-400 hover:bg-emerald-300 text-gray-900 text-xl font-bold py-4 px-6 lg:py-6 lg:px-10 lg:text-2xl rounded w-full"
                onClick={() => recordClick()}
              >
                Sign up now
              </button>



            </Link>
          </div>

          {/* <ul className="text-white text-xl flex flex-col w-full mt-14">
          <li className="py-2">✅ Stop living paycheck-to-paycheck</li>
          <li className="py-2">🐖 Build an emergency fund</li>
          <li className="py-2">💳 Pay off debt</li>
          <li className="py-2">🏝️ Save for that dream vacation</li>
          <li className="py-2">📈 See where your money is going</li>
          
        </ul> */}

          {/* <iframe className="mt-5 w-full" height="315" src="https://www.youtube.com/embed/-7CCYjqJePU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
 */}




        </section>
      </div>


      <h1 className="text-7xl md:text-5xl text-gray-900 font-bold ">How it works</h1>
      <section className="p-5 w-full max-w-6xl rounded mb-10 mt-5 flex flex-col lg:flex-row items-center lg:items-start justify-between w-full mb-5">


        <div className="flex flex-col mb-10 lg:mb-0">
          <p className="text-gray-900 text-2xl text-center lg:text-left mb-5"><span className="font-bold text-4xl border border-white p-1 px-4 rounded mr-2 bg-gray-900 text-white">1</span> Add categories</p>
          <p className="text-gray-900 text-xl text-center lg:text-left mb-5 max-w-sm ">You'll add categories for all of your bills, expenses, and savings goals. </p>
          <p className="text-gray-900 text-xl text-center lg:text-left mb-5 max-w-sm ">It's easy to set due dates and how much you'll need for each.</p>
          {/* <p className="text-sky-100 text-xl lg:max-w-xl text-center lg:text-left lg:pr-12">
              Whether you want to stop living paycheck-to-paycheck, save money for that dream vacation, pay off debt, or build an emergency fund, DollarGrad makes it simple.

            </p> */}


          {/* <span className="text-white text-2xl font-bold text-center lg:text-left mb-5">See where my money is going</span> */}




        </div>

        <CategoryDemo />




      </section>
      <section className="p-5 w-full max-w-6xl rounded mb-10 flex flex-col lg:flex-row items-center lg:items-start justify-between w-full mb-5">




        <div className="flex flex-col mb-10 lg:mb-0">
        <p className="text-gray-900 text-2xl text-center lg:text-left mb-5"><span className="font-bold text-4xl border border-white p-1 px-4 rounded mr-2 bg-gray-900 text-white">2</span> Add Accounts</p>
      



          <p className="text-gray-900 text-xl text-center lg:text-left mb-5 max-w-sm">Every dollar is assigned to categories. Fill them up as you get payed!</p>

          <div className="flex justify-center lg:justify-start">
            <span className="text-4xl">💳</span>
            <span className="text-4xl">💰</span>
            <span className="text-4xl">💵</span>
          </div>






        </div>


        <CategoryDemo values />



      </section>

      <section className="p-5 w-full max-w-6xl rounded mb-10 flex flex-col lg:flex-row items-center lg:items-start justify-between w-full mb-5">


        <div className="flex flex-col mb-10 lg:mb-0">
        <p className="text-gray-900 text-2xl text-center lg:text-left mb-5"><span className="font-bold text-4xl border border-white p-1 px-4 rounded mr-2 bg-gray-900 text-white">3</span> Enter Transactions</p>
      
          <p className="text-gray-900 text-xl text-center lg:text-left mb-5 max-w-sm">As you spend money, assign those transactions to categories. When you've spent more from a category than you budgeted, borrow from another!</p>

          <p className="text-gray-900 text-xl text-center lg:text-left mb-5 max-w-sm">Income gets budgeted: Keep filling those categories!</p>

          <Link to={data.signupLink} className="w-full lg:max-w-fit ">
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-xl font-bold py-4 px-6 rounded w-full"
              onClick={() => recordClick()}
            >
              Get Started
            </button>



          </Link>
        </div>

        <AccountDemo />


      </section>

    </main>
  );
}
