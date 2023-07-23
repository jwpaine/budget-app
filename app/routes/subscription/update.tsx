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


    if (user?.customer?.subscriptionStatus != 'active') {
        console.log("Subscription not active. Please subscribe first")
        return json({ error: "Subscription not active. Please subscribe first" })
    }

    const id = formData.get("id") as string // payment id
    const created = formData.get("created") as string
    const cardBrand = formData.get("cardBrand") as string
    const cardExpMonth = Number(formData.get("cardExpMonth")) as number
    const cardExpYear = Number(formData.get("cardExpYear")) as number
    const cardLast = formData.get("cardLast") as string

    console.log("received: ", id, created, cardBrand, cardExpMonth, cardExpYear, cardLast)


    const stripeCustomerId = user?.customer?.id

    // add new payment method to customer and set as default
    console.log('Updating payment method for customer: ', stripeCustomerId, ' with payment method: ', id)
    const updatedPaymentMethod = await UpdatePayment({
        id: stripeCustomerId,
        payment_method: id
    })

    if (updatedPaymentMethod?.error) {
        return json({ error: updatedPaymentMethod.error })
    }

    // delete each payment method from stripe except for the one just added:
    const paymentMethods = await stripe.paymentMethods.list({
        customer: stripeCustomerId,
        type: "card",
    });

    paymentMethods.data.forEach(async (paymentMethod) => {
        if (paymentMethod.id != id) {
            console.log("Detaching payment method: ", paymentMethod.id)
            await stripe.paymentMethods.detach(paymentMethod.id);
        } else {
            console.log("NOT detaching payment method: ", paymentMethod.id)
        }
    });

    return redirect(`/account`)




}