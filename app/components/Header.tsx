import { Link } from "@remix-run/react";

interface HeaderProps {
  userId: string;
}

export default function Header(props: HeaderProps) {

  return (
    <header className="flex fuxed top items-center justify-between bg-slate-100 p-4 text-white border-b border-slate-400">
      <Link
        to="/budget"
        className="flex items-center justify-center rounded-md border border-transparent bg-slate-800 text-white px-4 py-3 text-base font-medium shadow-sm hover:bg-slate-700 sm:px-8"
      >
        {props.userId ? "My Budget" : "Get Started"}
      </Link>



      <Link
        to={`/${props.userId ? "account" : "budget"}`}
        className="flex items-center justify-center rounded-md bg-sky-600 px-4 py-3 font-medium text-white hover:bg-sky-700  " >
       {props.userId ? "My Account" : "Log In"}
      </Link>



    </header>
  );
}
