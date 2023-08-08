import { useFetcher } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

export default function Checkout({ stripeKey, stripeClientSecret, updatePayment, paymentUpdated, subscription }: { stripeKey: string, stripeClientSecret: string, updatePayment: boolean, paymentUpdated: () => void, subscription: any }) {
  const stripePromise = loadStripe(stripeKey);

  

  //   const stripeOptions = {
  //     // passing the client secret obtained from the server
  //     clientSecret: data.stripeClientSecret,
  //   };

  return (
    <Elements stripe={stripePromise} >
      <CheckoutForm stripeClientSecret={stripeClientSecret} updatePayment={updatePayment} paymentUpdated={paymentUpdated} subscription={subscription} />
    </Elements>
  );
}

function CheckoutForm({ stripeClientSecret, updatePayment, paymentUpdated, subscription }: { stripeClientSecret: string, updatePayment: boolean, paymentUpdated: () => void, subscription: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setStripeError] = React.useState("");

  const handleStripeToken = async (event: any) => {
    console.log("Received stripe response:");
    event.preventDefault();

    // clear stripeError:
    setStripeError(null);

    // Ensure the CardElement is ready and mounted before attempting to create the payment method
    if (!elements || !elements.getElement(CardElement)) {
      console.log("CardElement not ready.");
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.log(error.message);
      let errorMessage = error.message || ""
      setStripeError(errorMessage);
      return
    }

    const url = updatePayment ? "/subscription/update" : "/subscription/create"
    console.log("updatePayment: ", updatePayment, " url: ", url)

    const r = subscription.submit(
      {

        id: paymentMethod.id,
        created: paymentMethod.created,
        cardBrand: paymentMethod.card.brand,
        cardExpMonth: paymentMethod.card.exp_month,
        cardExpYear: paymentMethod.card.exp_year,
        cardLast: paymentMethod.card.last4
      },
      { method: "post", action: url }
    );
    // if no error returned, return to account page:
    // @TODO: bulletproof this:
    if (!subscription.data?.error) {
      paymentUpdated()
    }



  };

  // Custom styles for the CardElement
  const cardElementStyle = {
    base: {
      color: "white",
      fontSize: "16px",
      "::placeholder": {
        color: "white",
      },
    },
  };



  return (
    <form onSubmit={handleStripeToken} className="flex flex-col w-full max-w-lg p-5 justify-center text-center">
      <label className="text-white w-full text-center">
        Card Details
        <CardElement options={{ style: cardElementStyle }} />
      </label>
      {/* You can add more form fields here */}
      <button className="rounded bg-emerald-300 text-slate-800 m-auto py-2 px-10" type="submit">Submit</button>
      {/* Display any error that happens when processing the payment */}
      {subscription?.data?.error && <div className="text-red-500">{subscription?.data?.error}</div>}
      {stripeError != "" && <div className="text-red-500">{stripeError}</div>}


    </form>
  );
}
