import { Link } from "@remix-run/react";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
// import StripeCheckout from "react-stripe-checkout";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// add imported in order to stripe.paymentIntents.create:
import Stripe from 'stripe';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

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
import CheckoutForm from "~/components/stripe/CheckoutForm";



export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  const secretKey = process.env.STRIPE_SECRET as string
  const stripeKey = process.env.STRIPE_KEY as string

  if (!secretKey) {
    throw new Error("STRIPE_KEY must be set");
  }

  // generate stripe client secret using stripe API:
  // const stripe = new Stripe(secretKey, {
  //   apiVersion: "2022-11-15",
  // });
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: 1000, // Replace with the actual amount in cents
  //   currency: 'usd', // Replace with the actual currency code
  // });

  // const stripeClientSecret = paymentIntent.client_secret;





  // if not stripe key, panic:

  // const account = await getAccount({ userId });
  const user = await getUserById({ id: userId, budgets: true, customer: true });

  return json({ userId, user, stripeKey });
}

// react useState hook accountState:


export default function Budget() {
  const data = useLoaderData<typeof loader>();

  const [accountState, setAccountState] = React.useState("details")
  const [confirmCancel, setConfirmCancel] = React.useState(false)
  const [updatePaymentMethod, setUpdatePaymentMethod] = React.useState(false)
  const[paymentUpdated, setPaymentUpdated] = React.useState(false)

  const subscription = useFetcher()

  const isInitialMount = React.useRef(true);




  const cancelSubscription = async () => {
    const r = subscription.submit(
      {

      },
      { method: "post", action: "/subscription/cancel" }
    );
    setConfirmCancel(false)
  }

  // useEffect on page load request subscription status from server using subscription.fetcher:
  React.useEffect(() => {

    const response = subscription.submit({}, { method: "get", action: "/subscription/get" });

  }, []);

  const renderPaymentMethods = () => {
    console.log("subscription data:", subscription.data)

    if (!subscription.data) return

    let paymentMethod = subscription.data.customer.defaultPaymentMethod

    if (!paymentMethod) return

    return <div className="p-2 rounded flex flex-col justify-evenly bg-sky-800 max-w-fit">
      <span className="text-white text-xs">{paymentMethod.brand} </span>
      <span className="text-white text-xs">**** **** **** {paymentMethod.last4}</span>
      <span className="text-white text-xs">Exp: {paymentMethod.expirationDate}</span>
    </div>

  }

  if (confirmCancel) return (

    <main className="bg-black h-full flex flex-col items-center p-2">
      <h1 className="text-xl text-white">Before you go</h1>
      <button onClick={() => cancelSubscription()} className="rounded p-2 w-fit text-blue-100 border border-red-900 hover:border-red-800 ml-2">Cancel Subscription</button>
    </main>

  )

  return (

    <main className="bg-black h-full flex flex-col p-2 ">
      <header>
        <h1 className="text-3xl text-white text-center">My Account</h1>
      </header>

      <div className="flex flex-col lg:flex-row items-center">


        <section className="flex flex-col items-center w-full border-r border-sky-700 ">


          <h3 className="text-xl text-white">{data?.user?.email}</h3>
          <Form action="/logout" method="post" className="p-2">

          </Form>

        </section>

        <section className="flex flex-col items-center w-full">

          {updatePaymentMethod ? (
            <div className="flex flex-col p-2 items-center">
              <span className="text-white text-center text-2xl mb-5">Update Payment Method</span>

                <CheckoutForm stripeKey={data.stripeKey} stripeClientSecret={data.stripeClientSecret} updatePayment={true} paymentUpdated={() => {
                  setPaymentUpdated(true)
                  setUpdatePaymentMethod(false)
                }}/>

              <button
                className="text-blue-100 hover:text-blue-200 mt-6 mb-5"
                onClick={() => setUpdatePaymentMethod(false)}
              >
                Nevermind, take me back
              </button>
            </div>
          ) : data?.user?.customer?.subscriptionStatus == "active" && (<div className="flex flex-col p-2 items-center">
            <span className="text-white text-center text-2xl mb-5">{paymentUpdated ? "Payment method updated!" : "Thank you for subscribing!"}</span>
            {subscription?.data?.nextBillingDate && <span className="text-white text-center mb-10">Next payment ($7.00): {subscription?.data?.nextBillingDate}</span>}

            {renderPaymentMethods()}

            <button
              className="text-blue-100 hover:text-blue-200 mt-6 mb-5"
              onClick={() => setUpdatePaymentMethod(true)}
            >
              Update Payment Method
            </button>



            <button
              type="submit"
              className="rounded text-blue-100 hover:text-blue-200 text-xs"
              onClick={() => setConfirmCancel(true)}
            >
              Cancel Subscription
            </button>



          </div>
          )}

          {!data?.user?.customer?.subscriptionId && <div>
            <span className="text-white">Subscribe now</span>
            <p>Subscribe for $7/month</p>
            <CheckoutForm stripeKey={data.stripeKey} stripeClientSecret={data.stripeClientSecret} updatePayment={false}/>

          </div>
          }

        </section>

      </div>

      <footer className="flex justify-center items-center flex-col w-full mt-20 ">
        <Link
          to="/logout"
          type="submit"
          className="rounded p-1 max-w-sm text-blue-100 border border-slate-500 hover:border-slate-400"
        >
          Logout
        </Link>


      </footer>


    </main>

  );

  if (accountState == "subscribe") return (
    <></>
  )

}
