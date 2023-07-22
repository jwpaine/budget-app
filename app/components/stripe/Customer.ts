

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const Create = async ({ email }: { email: string }) => {
    const customer = await stripe.customers.create({
        email
    });

    // if error, return json containing error:
    if (customer.error) {
        return ({ error: customer.error })
    }

    console.log(`customer created: ${customer.id}`)


    return customer
}

// obtain customer from stripe, along with default payment method:
export const Retrieve = async ({ id }: { id: string }) => {
    try {
        const customer = await stripe.customers.retrieve(id);

        // if error, return json containing error:
        if (customer.error) {
            return { error: customer.error };
        }

        // Get the default payment method details
        const defaultPaymentMethodId = customer.invoice_settings.default_payment_method;
        if (defaultPaymentMethodId) {
            const paymentMethod = await stripe.paymentMethods.retrieve(defaultPaymentMethodId);

            if (paymentMethod.card) {
                const { last4, brand, exp_month, exp_year } = paymentMethod.card;
                console.log(`Customer's default payment method details:`);
                console.log(`Brand: ${brand}`);
                console.log(`Last 4 digits: ${last4}`);
                console.log(`Expiration Date: ${exp_month}/${exp_year}`);

                // Return the customer object with the default payment method details
                return {
                    ...customer,
                    defaultPaymentMethod: {
                        brand,
                        last4,
                        expirationDate: `${exp_month}/${exp_year}`,
                    },
                };
            }
        }

        // If the customer doesn't have a default payment method or it's not a card payment method
        console.log(`Customer has no default payment method or it's not a card.`);
        return customer;
    } catch (error) {
        // Handle any errors that may occur during the retrieval
        console.error(`Error occurred while retrieving customer: ${error.message}`);
        return { error: error.message };
    }

};

// update customer's default payment method:
export const UpdatePayment = async ({ id, payment_method }: { id: string, payment_method: string }) => {
    console.log("attaching default payment method")
    try {
        const paymentMethod = await stripe.paymentMethods.attach(payment_method, { customer: id })

        const attach = await stripe.customers.update(id, {
            invoice_settings: {
                default_payment_method: payment_method
            }
        })
    } catch (e) {
        return { error: e.message}
    }
}

