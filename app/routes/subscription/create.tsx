import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/auth.server";

import { Create as CreateStripeCustomer, UpdatePayment } from "~/components/stripe/Customer"
import { Create as CreateStripePlan } from "~/components/stripe/Plan"
import { Create as CreateStripeSubscription } from "~/components/stripe/Subscription"
import { Create as CreateDatabaseCustomer, Update as UpdateDatabaseCustomer } from "~/models/customer.server"
import { getUserById } from "~/models/user.server";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export async function action({ request, params }: ActionArgs) {


    const userId = await requireUserId(request);

    const formData = await request.formData();
    const user = await getUserById({ id: userId, customer: true });


    if (user?.customer?.subscriptionStatus == 'active') {
        console.log("Subscription already active")
        return json({ error: "Subscription already active" })
    }

    const id = formData.get("id") as string // payment id
    const created = formData.get("created") as string
    const cardBrand = formData.get("cardBrand") as string
    const cardExpMonth = Number(formData.get("cardExpMonth")) as number
    const cardExpYear = Number(formData.get("cardExpYear")) as number
    const cardLast = formData.get("cardLast") as string

    console.log("received: ", id, created, cardBrand, cardExpMonth, cardExpYear, cardLast)

   
    const stripeCustomerId = user?.customer?.id

   

    // update payment method UpdatePayment = async ({ id, payment_method }: { id: string, payment_method: string }) => {
    console.log("Updating payment method for customer: ", stripeCustomerId, " with payment method: ", id)
    const updatedPaymentMethod = await UpdatePayment({
        id: stripeCustomerId,
        payment_method: id
    })

    if (updatedPaymentMethod?.error) {
        return json({ error: updatedPaymentMethod.error })
    }


    // create plan:
    // const plan = await CreateStripePlan()
    // if (plan.error) {
    //     return json({ error: plan.error })
    // }

    const stripeSubscription = await CreateStripeSubscription({ customerId: stripeCustomerId, plan_id: "plan_OIf6Sgh3Nfwo0F" })

    if (stripeSubscription?.error) {
        return json({ error: stripeSubscription.error })
    }

    // Add customer record to database if it doesn't already exist

    // otherwise, update existing customer record:
   
    const customer = await UpdateDatabaseCustomer({
            id: stripeCustomerId as string,
            userId,
            subscriptionId: stripeSubscription.id,
            subscriptionStatus: 'active'
    })


    return redirect(`/account`)



}