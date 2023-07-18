import { Link } from "@remix-run/react";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import StripeCheckout from "react-stripe-checkout";

import {
  Form,
  useCatch,
  useLoaderData,
  useActionData,
  useFetcher,
} from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";

import { requireUserId } from "~/auth.server";


import { getCategories } from "~/models/category.server";
import { Decimal } from "@prisma/client/runtime";
import { getAccount } from "~/models/account.server";
import { getUserById } from "~/models/user.server";



export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  const stripeKey = process.env.STRIPE_KEY as string
  // if not stripe key, panic:
  if (!stripeKey) {
    throw new Error("STRIPE_KEY must be set");
  }
  // const account = await getAccount({ userId });
  const user = await getUserById({ id: userId, budgets: true, customer: true });

  return json({ userId, user, stripeKey });
}

// react useState hook accountState:


export default function Budget() {
  const data = useLoaderData<typeof loader>();

  const [accountState, setAccountState] = React.useState("details")

  const subscription = useFetcher()




  const handleStripeToken = async (response: any) => {

    console.log("Received stripe response: ", response)

    const r = subscription.submit(
      {
        //stripe customer
        id: response.id,
        created: response.created,
        email: response.email,
        // card metadata
        cardBrand: response.card.brand,
        cardExpMonth: response.card.exp_month,
        cardExpYear: response.card.exp_year,
        cardId: response.card.id,
        cardLast: response.card.last4,
        cardName: response.card.name
      },
      { method: "post", action: "/subscription/create" }
    );

  }

  const cancelSubscription = async () => {
    const r = subscription.submit(
      {

      },
      { method: "post", action: "/subscription/cancel" }
    );
  }

  const renderStripeCheckout = () => {
    return <StripeCheckout
      token={handleStripeToken}
      stripeKey={data.stripeKey}
      amount={0}
      name="dollargrad.com"
      description="Subscribe for $7/month"
      // set button text from "Pay With Card" to "Subscribe":
      panelLabel="Subscribe"
    // billingAddress="true"
    />
  }


  return (
    <main className="bg-black h-full flex flex-col items-center">
      <h1>My Account</h1>
      <div className="p-2">
        <p className="text-white">Currently logged in as: {data?.user?.email}</p>



      </div>

      {data?.user?.customer?.subscriptionStatus == "active" && (<div className="flex flex-col p-2">
        <span className="text-white">You are subscribed!</span>

        <span className="text-white">Default Payment Method: {data.user.customer.cardBrand} **** **** **** {data.user.customer.cardLast}</span>

        <div className="flex my-5">
          <button
            className="rounded p-2 w-fit text-blue-100 border border-emerald-900 hover:border-emerald-800"
          >
            Update Payment Method
          </button>
          <button
            className="rounded p-2 w-fit text-blue-100 border border-red-900 hover:border-red-800 ml-2"
            onClick={() => cancelSubscription()}
          >
            Cancel Subscription
          </button>
        </div>
        </div>
      )
      }
      {/* customer never created */ }
      {!data?.user?.customer?.subscriptionId && <div className="flex flex-col p-2">
        <span className="text-white">You are not subscribed :(</span>
        {renderStripeCheckout()}
      </div>
      }
      <Form action="/logout" method="post" className="p-2">
        <button
          type="submit"
          className="rounded p-5 text-blue-100 border border-slate-500 hover:border-slate-400"
        >
          Logout
        </button>
      </Form>

    </main>
  );

  if (accountState == "subscribe") return (
    <></>
  )

}
