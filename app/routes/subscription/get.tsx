import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/auth.server";

import { Create as CreateStripeCustomer } from "~/components/stripe/Customer"
import { Create as CreateStripePlan } from "~/components/stripe/Plan"
import { Create as CreateStripeSubscription } from "~/components/stripe/Subscription"
import { Create as CreateDatabaseCustomer, Update as UpdateDatabaseCustomer } from "~/models/customer.server"
import { getUserById } from "~/models/user.server";

import { Retrieve as RetrieveCustomer } from "~/components/stripe/Customer";
import { Retrieve as RetrieveSubscription } from "~/components/stripe/Subscription";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

// export async function action({ request, params }: ActionArgs) {


//     const userId = await requireUserId(request);

//     const formData = await request.formData();
//     const user = await getUserById({ id: userId, customer: true });



export async function loader({ request, params }: LoaderArgs) {

    const userId = await requireUserId(request);
    const user = await getUserById({ id: userId, customer: true });

    if (!user) {
        console.log("User not found")
        return json({ error: "User not found" })
    }

    const customerId = user.customer?.id as string
    const subscriptionId = user.customer?.subscriptionId

    if (!customerId) {
        console.log("Customer not found")
        return json({ error: "Customer not found" })
    }   

    const customer = await RetrieveCustomer({ id: customerId })
    const subscription = await RetrieveSubscription({ id: subscriptionId as string })

    // obtain next billing date for subscription:
    const nextBillingDate = new Date(subscription.current_period_end * 1000)
    // format to Month name, day, year:
    const nextBillingDateFormatted = nextBillingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })


    return json({customer: customer, nextBillingDate: nextBillingDateFormatted})

}