import { useFetcher } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function Checkout({ stripeKey, stripeClientSecret, updatePayment, paymentUpdated } : { stripeKey: string, stripeClientSecret: string, updatePayment: boolean, paymentUpdated: () => void }) {
  const stripePromise = loadStripe(stripeKey);


//   const stripeOptions = {
//     // passing the client secret obtained from the server
//     clientSecret: data.stripeClientSecret,
//   };

  return (
    <Elements stripe={stripePromise} >
      <CheckoutForm stripeClientSecret={stripeClientSecret} updatePayment={updatePayment} paymentUpdated={paymentUpdated}/>
    </Elements>
  );
}

function CheckoutForm({ stripeClientSecret, updatePayment, paymentUpdated } : { stripeClientSecret: string, updatePayment: boolean, paymentUpdated: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const subscription = useFetcher()

  const handleStripeToken = async (event: any) => {
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
      if (!subscription.data?.error) {
       window.location.href = "/account"
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
    <form onSubmit={handleStripeToken}>
      <div style={{ display: "flex", flexDirection: "column", color: "white", width: "400px" }}>
        <label style={{ marginBottom: "12px" }}>
          Card Details
          <CardElement options={{ style: cardElementStyle }} />
        </label>
        {/* You can add more form fields here */}
        <button className="bg-emerald-300 text-white" type="submit">Submit</button>
        {/* Display any error that happens when processing the payment */}
        {subscription?.data?.error && <div className="text-red-500">{subscription?.data?.error}</div>}
      </div>
    </form>
  );
}
