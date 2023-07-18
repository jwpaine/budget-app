import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/auth.server";

import { Create as CreateStripeCustomer } from "~/components/stripe/Customer"
import { Create as CreateStripePlan } from "~/components/stripe/Plan"
import { Create as CreateStripeSubscription } from "~/components/stripe/Subscription"
import { Create as CreateDatabaseCustomer, Update as UpdateDatabaseCustomer } from "~/models/customer.server"
import { getUserById } from "~/models/user.server";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export async function action({ request, params }: ActionArgs) {


    const userId = await requireUserId(request);

    const formData = await request.formData();
    const user = await getUserById({ id: userId, customer: true });

    if (!user) {
        console.log("User not found")
        return json({ error: "User not found" })
    }

    if (user.customer && user.customer.subscriptionStatus == 'active') {
        console.log("Subscription already active")
        return json({ error: "Subscription already active" })
    }

    const id = formData.get("id") as string
    const created = formData.get("created") as string
    const cardBrand = formData.get("cardBrand") as string
    const cardExpMonth = Number(formData.get("cardExpMonth")) as number
    const cardExpYear = Number(formData.get("cardExpYear")) as number
    const cardId = formData.get("cardId") as string
    const cardLast = formData.get("cardLast") as string
    const cardName = formData.get("cardName") as string

    console.log("received: ", id, created, cardBrand, cardExpMonth, cardExpYear, cardId, cardLast, cardName)

    let stripeCustomerId = null

    if (user.customer) {
        console.log("User already has a customer")
        stripeCustomerId = user.customer.id
    } else {
        console.log("User does not have a stripe customer assigned, creating one...")
        // create stripe customer
        const stripeCustomer = await CreateStripeCustomer({ id, email: user.email })
        // if error, return json containing error:
        if (stripeCustomer.error) {
            console.log("Error creating stripe customer: ", stripeCustomer.error)
            return json({ error: "Error creating customer" })
        }
        stripeCustomerId = stripeCustomer.customer.id

    }


    // create plan:
    const plan = await CreateStripePlan()
    if (plan.error) {
        return json({ error: plan.error })
    }
    const stripeSubscription = await CreateStripeSubscription({ customerId: stripeCustomerId, plan: plan.plan })

    if (stripeSubscription.error) {
        return json({ error: stripeSubscription.error })
    }

    // Add customer record to database if it doesn't already exist
    if (!user.customer) {
        const customer = await CreateDatabaseCustomer({
            id: stripeCustomerId,
            userId,
            subscriptionId: stripeSubscription.subscription.id,
            subscriptionStatus: 'active',
            cardBrand,
            cardExpMonth,
            cardExpYear,
            cardId,
            cardLast
        })
        return redirect(`/account`)
    }
    // otherwise, update existing customer record:
    const customer = await UpdateDatabaseCustomer({
        id: user.customer.id,
        userId,
        subscriptionId: stripeSubscription.subscription.id,
        subscriptionStatus: 'active',
        cardBrand,
        cardExpMonth,
        cardExpYear,
        cardId,
        cardLast
    })
    return redirect(`/account`)


   
}