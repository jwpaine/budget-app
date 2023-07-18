import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/auth.server";

import {Cancel as CancelStripeSubscription} from "~/components/stripe/Subscription"
import { SetSubscriptionCancelled } from "~/models/customer.server"

import { getUserById } from "~/models/user.server";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

// this action is used to cancel a stripe subscription
export async function action({ request, params }: ActionArgs) {

    const userId = await requireUserId(request);
  
    const formData = await request.formData();
    const user = await getUserById({id: userId, customer: true});

    if(!user) {
        console.log("User not found")
        return json({ error: "User not found" })
    }
    if(!user.customer) {
        console.log("User does not have an assigned customer")
        return json({ error: "No customer account assigned" })
    }

    const id = user.customer.subscriptionId as string
    console.log("Canceling subscription: ", id)

    const cancelledSubscription = await CancelStripeSubscription({id: id})
    if(cancelledSubscription.error) {
        console.log(cancelledSubscription.error)
        return json({ error: "Error canceling subscription" })
    }

    // mark subscription as cancelled in database:
    console.log("about to update customer: ", user.customer.id)
    const cancelled = await SetSubscriptionCancelled({id: user.customer.id})

    

   
    return redirect(`/account`)
}