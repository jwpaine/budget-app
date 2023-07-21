import { useFetcher } from "@remix-run/react";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function Checkout({ stripeKey, stripeClientSecret }) {
  const stripePromise = loadStripe(stripeKey);


//   const stripeOptions = {
//     // passing the client secret obtained from the server
//     clientSecret: data.stripeClientSecret,
//   };

  return (
    <Elements stripe={stripePromise} >
      <CheckoutForm stripeClientSecret={stripeClientSecret} />
    </Elements>
  );
}

function CheckoutForm({ stripeClientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const subscription = useFetcher()

  const handleStripeToken = async (event) => {
    console.log("Received stripe response:");
    event.preventDefault();

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
      return
    } 

    const r = subscription.submit(
        {
          
          id: paymentMethod.id,
          created: paymentMethod.created,
          cardBrand: paymentMethod.card.brand,
          cardExpMonth: paymentMethod.card.exp_month,
          cardExpYear: paymentMethod.card.exp_year,
          cardLast: paymentMethod.card.last4
        },
        { method: "post", action: "/subscription/create" }
      );
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
    <form onSubmit={handleStripeToken}>
      <div style={{ display: "flex", flexDirection: "column", color: "white", width: "400px" }}>
        <label style={{ marginBottom: "12px" }}>
          Card Details
          <CardElement options={{ style: cardElementStyle }} />
        </label>
        {/* You can add more form fields here */}
        <button className="bg-emerald-300 text-white" type="submit">Submit</button>
      </div>
    </form>
  );
}
