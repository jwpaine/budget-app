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
    <main className="flex flex-col bg-gray-900 w-full items-center">
      <section className="flex flex-col justify-center content-center items-center lg:items-start w-full max-w-6xl p-5 mb-10">


        <h1 className="text-5xl md:text-7xl text-white font-bold">Budgeting</h1>
        <h1 className="text-6xl md:text-8xl text-white font-bold py-2">Made</h1>
        <h1 className="text-7xl md:text-9xl text-emerald-400 font-bold">Simple</h1>
        <p className="text-sky-100 text-xl lg:text-2xl py-5 my-5 text-center lg:text-left">
          We make it <span className="font-bold ">easy</span> to track monthly expenses, and budget for the road ahead.
        </p>
        <Link to={data.signupLink} className="w-full lg:max-w-fit ">
          <button className="bg-emerald-400 hover:bg-emerald-300 text-gray-900 text-xl font-bold py-4 px-6 rounded w-full"
            onClick={() => recordClick()}
          >
            Try DollarGrad for Free
          </button>
        </Link>








      </section>
      <section className="bg-gray-800 p-5 w-full max-w-6xl rounded mb-10">

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full mb-5">

          <div className="flex flex-col mb-10 lg:mb-0">
            <span className="text-white text-2xl font-bold text-center lg:text-left mb-5">It all starts with a budget </span>
            {/* <p className="text-sky-100 text-xl lg:max-w-xl text-center lg:text-left lg:pr-12">
              Whether you want to stop living paycheck-to-paycheck, save money for that dream vacation, pay off debt, or build an emergency fund, DollarGrad makes it simple.

            </p> */}
            <ul className="text-white text-xl lg:text-2xl">
              <li className="py-2">✅ Stop living paycheck-to-paycheck</li>
              <li className="py-2">🐖 Build an emergency fund</li>
              <li className="py-2">💳 Pay off debt</li>
              <li className="py-2">🏝️ Save for that dream vacation</li>
              <li className="py-2">📈 See where my money is going</li>
            </ul>

            {/* <span className="text-white text-2xl font-bold text-center lg:text-left mb-5">See where my money is going</span> */}




          </div>

          <CategoryDemo />

        </div>
        <Link to={data.signupLink} className="w-full lg:max-w-fit ">
          <button className="bg-sky-400 hover:bg-sky-300 text-gray-900 text-xl font-bold py-4 px-6 rounded w-full lg:max-w-fit mt-5"
            onClick={() => recordClick()}
          >
            Start My Free Trial
          </button>
        </Link>

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
