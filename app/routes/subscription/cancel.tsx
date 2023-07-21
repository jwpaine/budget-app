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

    const s_id = user.customer.subscriptionId as string
    const c_id = user.customer.id as string

    console.log("Canceling subscription: ", s_id)

    const cancelledSubscription = await CancelStripeSubscription({id: s_id})
    if(cancelledSubscription.error) {
        console.log(cancelledSubscription.error)
        return json({ error: "Error canceling subscription" })
    }

    const paymentMethods = await stripe.paymentMethods.list({
        customer: c_id,
        type: "card",
    });
    // delete each payment method from stripe:
    paymentMethods.data.forEach(async (paymentMethod) => {
         await stripe.paymentMethods.detach(paymentMethod.id);
    });

    // mark subscription as cancelled in database:
    const cancelled = await SetSubscriptionCancelled({id: c_id})

    

   
    return redirect(`/account`)
}