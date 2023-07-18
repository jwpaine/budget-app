

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const Create = async ({email, id} : {email: string, id: string}) => {
    const customer = await stripe.customers.create({
        email,
        source: id
    });

    // if error, return json containing error:
    if (customer.error) {
        return ({ error: customer.error })
    }

    console.log(`customer created: ${customer.id}`)

    return {customer: customer}
}