const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const Create = async () => {
        
        console.log('creating product')
 
        const product = await stripe.products.create({
            name: 'Dollargrad Subscription',
            type: 'service',
        });

        if(product.error) {
            console.log("error creating product: ", product.error)
            return { error: product.error }
        }

        console.log('creating plan')

        const plan = await stripe.plans.create({
            currency: 'usd',
            interval: 'month',
            product: product.id,
            nickname: `Subscription`,
            amount_decimal: 500 // $5.00
        });

        if (plan.error) {
            console.log("error creating plan: ", plan.error)
            return { error: plan.error }
        }

        console.log(`plan created: ${plan.id}`)

        return plan

    }

