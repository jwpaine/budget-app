import { Link } from "@remix-run/react";

interface HeaderProps {
  userId: string;
}

export default function Header(props: HeaderProps) {

  return (
    <footer className="flex fixed bottom-0 left-0 w-full items-center justify-between bg-black p-2 text-white border-b border-gray-700">
      <Link
        to="/budget"
        className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-3 text-base font-medium shadow-sm hover:bg-slate-800 sm:px-8"
      >
        {props.userId ? "My Budget" : "Get Started"}
      </Link>



      <Link
        to={`/${props.userId ? "account" : "budget"}`}
        className="flex items-center justify-center rounded-md bg-sky-600 px-4 py-3 font-medium text-white hover:bg-sky-700  " >
       {props.userId ? "My Account" : "Log In"}
      </Link>



    </footer>
  );
}
