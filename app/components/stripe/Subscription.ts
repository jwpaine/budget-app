
const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const Create = async ({ customerId, plan }: { customer: any, plan: any }) => {

    console.log('creating subscription')

    //  let date = new Date(); 

    // let billing_cycle_anchor = new Date(date.getFullYear(), date.getMonth(), 1); 
    // billing_cycle_anchor.setMonth(billing_cycle_anchor.getMonth())

    let sub_data = {
        customer: customerId,
        items: [
            {
                plan: plan.id
            }
        ]
    }

    const subscription = await stripe.subscriptions.create(sub_data);

    if (subscription.error) {
        console.log(`subscription creation error: ${subscription.error}`)
        return { error: subscription.error }
    }
    console.log(`subscription created: ${subscription.id}`)
    return { subscription }

}

export const getSubscription = async ({ id }: { id: string }) => {
    return await stripe.subscriptions.retrieve(id)
}

// cancel stripe subscription:
export const Cancel = async ({ id }: { id: string }) => {

    // cancel subscription:
    const subscription = await stripe.subscriptions.del(id);
  
    if (subscription.error) {
      console.log(`subscription cancellation error: ${subscription.error}`)
      return { error: subscription.error }
    }
    return subscription
  }
  