
const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const Create = async ({ customerId, price_id }: { customer: any, price_id: string }) => {

    console.log('creating subscription')

    //  let date = new Date(); 

    // let billing_cycle_anchor = new Date(date.getFullYear(), date.getMonth(), 1); 
    // billing_cycle_anchor.setMonth(billing_cycle_anchor.getMonth())

    let sub_data = {
        customer: customerId,
        items: [
            {
                price: price_id
            }
        ]
    }

   try {
        const subscription = await stripe.subscriptions.create(sub_data);
        console.log('subscription created: ')
        return subscription
   } catch (error) {
         return { error: error }
    }

    
}

export const Retrieve = async ({ id }: { id: string }) => {
    try {
        return await stripe.subscriptions.retrieve(id)
    } catch (error) {
        return { error: error }
    }
}

// cancel stripe subscription:
export const Cancel = async ({ id }: { id: string }) => {

    // cancel subscription:
    try {
        const subscription = await stripe.subscriptions.del(id);
        return subscription
    } catch (error) {
        return { error: error }
    }



}
