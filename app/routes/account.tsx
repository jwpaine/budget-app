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
  } else {
    console.log('stripe key: ', stripeKey)
  }
  // const account = await getAccount({ userId });
  const user = await getUserById(userId);

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

  const renderStripeCheckout = () => {
    return <StripeCheckout
      token={handleStripeToken}
      stripeKey={data.stripeKey}
      amount={0}
      name="dollargrad.com"
    // billingAddress="true"
    />
  }


  return (
    <main className="bg-black h-full flex flex-col items-center">
      <h1>My Account</h1>
      <div className="p-2">
        <p className="text-white">Currently logged in as: {data?.user?.email}</p>
        {/* <p className="text-white">{JSON.stringify(data?.user)} </p> */}
      </div>

      <div className="p-2">
       <span className="text-white">No Active Subscription. Subscribe to unlock more features.</span>
        {renderStripeCheckout()}
       
      </div>
      <Form action="/logout" method="post" className="p-2">
        <button
          type="submit"
          className="rounded p-5 text-blue-100 border border-slate-500 hover:font-bold"
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
