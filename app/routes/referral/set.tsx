import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { r } from "vitest/dist/types-94cfe4b4";
import { requireUserId } from "~/auth.server";

import { Create } from "~/models/referral.server";

const stripe = require("stripe")(process.env.STRIPE_SECRET);



export async function action({ request, params }: ActionArgs) {


    const userId = await requireUserId(request);

    const formData = await request.formData();
   
    const code = formData.get("code") as string

    console.log("received: ", code)

    const referral = await Create({ userId, code })

    if (referral?.error) {
        console.log("referral error: ", referral.error)
        return json(referral)
    }

    console.log("referral code added ")

    return redirect("/account")
   



}   