import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { sign } from "crypto";
import { requireUserId } from "~/auth.server";

import { Cancel as CancelStripeSubscription } from "~/components/stripe/Subscription"
import { SetSubscriptionCancelled } from "~/models/customer.server"

import { getUserById } from "~/models/user.server";
import { retrieve } from "~/models/customer.server";


const stripe = require("stripe")(process.env.STRIPE_SECRET);
const webhook_secret = process.env.STRIPE_WEBHOOK_SECRET;

// const cancelled = await SetSubscriptionCancelled({id: c_id})
// const cancelledSubscription = await CancelStripeSubscription({id: s_id})

// const paymentMethods = await stripe.paymentMethods.list({
//     customer: c_id,
//     type: "card",
// });
// // delete each payment method from stripe:
// paymentMethods.data.forEach(async (paymentMethod) => {
//      await stripe.paymentMethods.detach(paymentMethod.id);
// });

// this action is used to cancel a stripe subscription
export async function action({ request, params }) {

    // Verify the Stripe signature
    const sigHeader = request.headers.get('stripe-signature');
    const rawBody = await request.text();

    try {
        const event = stripe.webhooks.constructEvent(rawBody, sigHeader, webhook_secret);

        // Handle the event here based on its type
        console.log('event received: ')
        switch (event.type) {

            case 'invoice.payment_failed':
                // Handle failed payment
                let invoice = event.data.object
                console.log("invoice payment failed: ", invoice)

                let i_cid = invoice.customer
                console.log("payment failed for customer id: ", i_cid)

                console.log('Canceling subscription')
                const customer = await retrieve({ id: i_cid })
                const s_id = customer?.subscriptionId
                const cancelledSubscription = await CancelStripeSubscription({ id: s_id })
                const cancelled = await SetSubscriptionCancelled({ id: i_cid })
                // remove payment methods from stripe:
                console.log("removing payment methods from stripe")
                const paymentMethods = await stripe.paymentMethods.list({
                    customer: i_cid,
                    type: "card",
                });
                // delete each payment method from stripe:
                paymentMethods.data.forEach(async (paymentMethod) => {
                    await stripe.paymentMethods.detach(paymentMethod.id);
                });

                break;

            case 'subscription_schedule.canceled':
                let ss_cid = event.data.object.customer
                console.log("subscription schedule canceled for customer id: ", ss_cid)
                break;

            case 'customer.subscription.deleted':
                let subscription = event.data.object
                let subscription_id = subscription.id
                let s_cid = subscription.customer
                console.log('customer subscription deleted for customer id: ', s_cid);
                break;

            default:
                // Unexpected event type
                console.log('Unexpected event type:', event.type);
        }

        return json({ received: true });
    } catch (error) {
        console.error('Error verifying Stripe signature:', error.message);
        return json({ error: 'Invalid signature' }, { status: 400 });
    }
}