import { Link } from "@remix-run/react";

interface HeaderProps {
  userId: string;
}

export default function Header(props: HeaderProps) {

  return (
    <header className="flex w-full items-center justify-between bg-gray-950 py-4 px-2 text-white ">
      <Link
        to="/budget"
        className="flex items-center justify-center text-white px-4 py-3 text-base font-medium shadow-sm sm:px-8 hover:font-bold"
      >
        {props.userId ? "My Budget" : "Get Started"}
      </Link>



      <Link
        to={`/${props.userId ? "account" : "budget"}`}
        className="flex items-center justify-center px-4 py-3 font-medium text-white hover:font-bold" >
       {props.userId ? "My Account" : "Log In"}
      </Link>



    </header>
  );
}
