import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/auth.server";

import {Cancel as CancelStripeSubscription} from "~/components/stripe/Subscription"
import { SetSubscriptionCancelled } from "~/models/customer.server"

import { getUserById } from "~/models/user.server";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

// this action is used to cancel a stripe subscription
export async function action({ request, params }: ActionArgs) {

    console.log('received request data: ', request.body)

  
   // const formData = await request.formData();
    return json({ message: "ok" }, { headers: { "Cache-Control": "no-store" } });

}