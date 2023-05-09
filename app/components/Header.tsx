import { Form, Link, useLoaderData } from "@remix-run/react";


export default function Header(props) {

  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      {props.userId ? (
        <>
          <Link
            to="/accounts"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
          >
            Accounts
          </Link>

          <Form action="/logout" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Logout
            </button>
          </Form>
        </>
      ) : (
        <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
          {/* <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
                    >
                      Sign up
                    </Link> */}
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
