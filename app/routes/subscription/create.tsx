import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/auth.server";

import {Create as CreateStripeCustomer} from "~/components/stripe/Customer"
import {Create as CreateStripePlan} from "~/components/stripe/Plan"
import {Create as CreateStripeSubscription} from "~/components/stripe/Subscription"
import {Create as CreateDatabaseSubscription} from "~/models/subscription.server"
import { getUserById } from "~/models/user.server";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export async function action({ request, params }: ActionArgs) {


    const userId = await requireUserId(request);
  
    const formData = await request.formData();
    const user = await getUserById({id: userId});

    if(!user) {
        return json({ error: "User not found" })
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

    
    // create stripe customer
    const customer = await CreateStripeCustomer({id, email: user.email })
    // if error, return json containing error:
    if (customer.error) {
        return json({ error: customer.error })
    }

    // create plan:
    const plan = await CreateStripePlan()
    if (plan.error) {
        return json({ error: plan.error })
    }
    const stripeSubscription = await CreateStripeSubscription({customer : customer.customer, plan: plan.plan})

    if (stripeSubscription.error) {
        return json({ error: stripeSubscription.error })
    }

    // create subscription in database by passing correct values to CreateDatabaseSubscription():
    const subscription = await CreateDatabaseSubscription({id, userId, status : 'active', type : 'default', customerId : customer.customer.id, cardBrand, cardExpMonth, cardExpYear, cardId, cardLast})

    if(subscription.error) {
        return json({ error: subscription.error })
    }




    return redirect(`/account`)
}