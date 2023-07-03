import {Link} from "@remix-run/react";

interface HeaderProps {
  userId: string;
}

export default function Header(props: HeaderProps) {

  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      {props.userId ? (
        <>
          <Link
            to="/budget"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
          >
            My Budget
          </Link>
          <Link
            to="/account"
            className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600  " >
            My Account
          </Link>
        </>
      ) : (
        <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
          <Link
            to="/auth"
            className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600  "
          >
            Log In
          </Link>
        </div>
      )}
    </header>
  );
}
