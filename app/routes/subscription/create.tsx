import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/auth.server";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export async function action({ request, params }: ActionArgs) {

    const createSubscription = async (customer: any, plan: any) => {
        console.log('creating subscription')

        let date = new Date(); 
                  
        // let billing_cycle_anchor = new Date(date.getFullYear(), date.getMonth(), 1); 
        // billing_cycle_anchor.setMonth(billing_cycle_anchor.getMonth())
        
         let sub_data = {
                customer: customer.id,
                items: [
                    {
                        plan: plan.id
                    }
                ]
        }

        const subscription = await stripe.subscriptions.create(sub_data);

        if (subscription.error) {
            console.log(`subscription creation error: ${subscription.error}`)
            return { subscription, error: subscription.error }
        }
        return { subscription, error: null}

    }


    const createPlan = async () => {
        
        console.log('creating product')
 

        const product = await stripe.products.create({
            name: 'Dollargrad Subscription',
            type: 'service',
        });

        if(product.error) {
            console.log("error creating product: ", product.error)
            return { plan: null, error: product.error }
        }

        console.log('creating plan')

        const plan = await stripe.plans.create({
            currency: 'usd',
            interval: 'month',
            product: product.id,
            nickname: `Subscription`,
            amount_decimal: 700 // $7.00
        });

        if (plan.error) {
            console.log("error creating plan: ", plan.error)
            return { plan, error: plan.error }
        }

        return plan

    }




    const userId = await requireUserId(request);
  
    const formData = await request.formData();

    const id = formData.get("id") as string
    const created = formData.get("created") as string
    const email = formData.get("email") as string
    const cardBrand = formData.get("cardBrand") as string
    const cardExpMonth = formData.get("cardExpMonth") as string
    const cardExpYear = formData.get("cardExpYear") as string
    const cardId = formData.get("cardId") as string
    const cardLast = formData.get("cardLast") as string
    const cardName = formData.get("cardName") as string

    // create stripe customer
    const customer = await stripe.customers.create({
        email,
        source: id
    });

    // if error, return json containing error:
    if (customer.error) {
        return json({ error: customer.error })
    }

    // create plan:
    const plan = await createPlan()
    if (plan.error) {
        return json({ error: plan.error })
    }
    const subscription = await createSubscription(customer, plan)
    if (subscription.error) {
        return json({ error: subscription.error })
    }

    console.log("Subscription Created!")

    // save stripe customer data to subscription table

    
    return redirect(`/account`)
}