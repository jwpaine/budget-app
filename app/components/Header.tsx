import { Link } from "@remix-run/react";
import { useInsights } from "~/InsightsContext";

interface HeaderProps {
  userId: string;
  signupLink: string;
}



export default function Header(props: HeaderProps) {

let insights = useInsights();


// create async function called recordClick:
const recordClick = async (name: string) => {
  // Track event only on the client side
  if (typeof window !== "undefined") {
    await insights.trackEvent({ name: name});
  } 
};

  return (
    <header className="flex w-full items-center justify-between bg-gray-950 py-4 px-2 text-white ">
      <Link
        to={props.userId ? "/budget" : props.signupLink}
        className="flex items-center justify-center text-white px-4 py-3 text-base font-medium shadow-sm sm:px-8 hover:font-bold"
        onClick={() => recordClick( props.userId ? "My Budget Clicked (header)" : "Get Started Clicked (header)")}
      >
        {props.userId ? "My Budget" : "Create Account"}
      </Link>



      <Link
        to={`/${props.userId ? "account" : "budget"}`}
        className="flex items-center justify-center px-4 py-3 font-medium text-white hover:font-bold"
        onClick={() => recordClick( props.userId ? "My Account Clicked (header)" : "Login In Clicked (header)")}
        >
       {props.userId ? "My Account" : "Log In"}
      </Link>



    </header>
  );
}
