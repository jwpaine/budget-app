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

  const user = await getUserById({ id: userId, referral: true });

  return json({ userId, user, stripeKey });
}


export default function Budget() {
  const data = useLoaderData<typeof loader>();

  const [accountState, setAccountState] = React.useState("details")
  const [confirmCancel, setConfirmCancel] = React.useState(false)
  const [updatePaymentMethod, setUpdatePaymentMethod] = React.useState(false)
  const [paymentUpdated, setPaymentUpdated] = React.useState(false)

  const subscription = useFetcher()
  const referral = useFetcher();

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

  const renderReferralDetails = () => {
    if (subscription?.data?.status != "active") return (
      <div>
        <span className="text-white">Referral program requires an active subscription</span>
      </div>
    )

    return <div>
      <h2 className="text-white text-3xl text-center mb-5">My Referrals</h2>
      <p className="text-white text-center text-xl mb-5">We will credit you $1/month for each person you refer, as long as they maintain their subscription.</p>
      {data?.user?.referral?.code ? (
        <p className="text-white text-center text-2xl mb-5">My Referral Code: {data?.user?.referral?.code}</p>

      ) : (

        <referral.Form
          className="flex flex-col items-center w-full"
          method="post"
          action="/referral/set"
        >
          <span className="text-white text-center text-2xl mb-5">Create my referral code </span>
          <input
            className="rounded p-2 w-full text-black"
            type="text"
            name="code"
            placeholder="My Referral Code"
            defaultValue={data?.user?.referral?.code}
          />
          <button
            type="submit"
            className="rounded p-2 w-fit text-blue-100 border border-slate-500 hover:border-slate-400"
          >
            Update
          </button>
        </referral.Form>

      )}

      {referral?.data?.error && <div className="text-red-500">{referral?.data?.error}</div>}
    </div>
  }



  const renderAccountDetails = () => {

    return <section className="flex flex-col items-center w-full border-r border-sky-700 ">

      <h3 className="text-xl text-white">{data?.user?.email}</h3>





    </section>

  }

  const getTrialDaysLeft = () => {
      const createdAt = new Date(data.user.createdAt)
      const now = new Date()
      const diff = now.getTime() - createdAt.getTime()
      const days = diff / (1000 * 3600 * 24);

      const remaining = 30-days > 0 ? Math.ceil(30 - days) : 0

      return remaining
  }

  const renderSubscriptionDetails = () => {

    if (!subscription.data) return

    return <section className="flex flex-col items-center w-full">

      {/* <span className="text-white text-center text-2xl mb-5">Subscription Details: {JSON.stringify(subscription.data.status)}</span> */}

      {subscription?.data?.status == "active" ? (<div className="flex flex-col p-2 items-center">
        <span className="text-white text-center text-2xl mb-5">Thank you for subscribing!</span>
        <span className="text-white text-center mb-10">Next payment ($5.00): {subscription?.data?.nextBillingDate}</span>

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
      ) : (<div className="flex flex-col w-full justify-center items-center p-5">
        {subscription?.state == "submitting" ? (
          <span className="text-white text-center w-full text-xl">Submitting, please wait...</span>
        ) : (
          <>
            <span className="text-white text-center text-xl mb-5">{getTrialDaysLeft()} days left in your 1 year trial!</span>
            <span className="w-full text-white text-center text-2xl">Subscribe now for $5/month</span>
            <CheckoutForm stripeKey={data.stripeKey} stripeClientSecret={data.stripeClientSecret} updatePayment={false} subscription={subscription} />
          </>
        )}
      </div>
      )}


    </section>

  }

  if (confirmCancel) return (

    <main className="h-full flex flex-col items-center justify-center content-center p-2">
      <header>
        <h1 className="text-6xl text-white text-center p-5">WAIT!</h1>
      </header>
      <section className="max-w-lg flex flex-col">
        <h2 className="text-3xl text-white text-center">You are about to cancel your DollarGrad subscription.</h2>
        <h3 className="text-white text-center mt-5">Your subscription will be immediately canceled and you will need to re-subscribe in order to re-gain access to your
          budgets, accounts, transactions and categories in DollarGrad.</h3>
        <button onClick={() => setConfirmCancel(false)} className="w-full rounded bg-emerald-300 text-slate-800 m-auto py-2 px-10 mt-5" type="submit">No, take me back!</button>
        <a onClick={() => cancelSubscription()} className="text-white text-center mt-10 hover:cursor-pointer hover:text-slate-300">Cancel Subscription</a>
      </section>
    </main>

  )

  if (updatePaymentMethod) return (
    <main className="h-full flex flex-col p-2 ">
      <header>
        <h1 className="text-3xl text-white text-center">Update Payment Method</h1>
      </header>
      <div className="flex flex-col p-2 items-center">

        <CheckoutForm stripeKey={data.stripeKey} stripeClientSecret={data.stripeClientSecret} updatePayment={true} subscription={subscription} />

        <button
          className="text-blue-100 hover:text-blue-200 mt-6 mb-5"
          onClick={() => setUpdatePaymentMethod(false)}
        >
          Nevermind, take me back
        </button>
      </div>
    </main>
  )

  return (

    <main className="h-full flex flex-col p-2 ">
      <header>
        <h1 className="text-3xl text-white text-center">My Account</h1>
      </header>

      <div className="flex flex-col lg:flex-row items-center">


        {renderAccountDetails()}

        {renderSubscriptionDetails()}


      </div>

      {/* <div className="flex flex-col items-center border border-slate-800 m-5 mt-10 p-10">
        {renderReferralDetails()}
      </div> */}

      <footer className="flex justify-center items-center flex-col w-full mt-20 ">
        <Link
          to="/logout"
          type="submit"
          className="rounded border border-slate-600 text-slate-300 m-auto py-2 px-10"
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
