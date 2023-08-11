import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { cssBundleHref } from "@remix-run/css-bundle";

import tailwindStylesheetUrl from "~/styles/tailwind.css";
import { getUserId, signupLink } from "~/auth.server";

import Header  from "./components/Header"
import Footer  from "./components/Footer"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  
    // ...(cssBundleHref
    //   ? [{ rel: "stylesheet", href: cssBundleHref }]
    //   : []),
 
];

export const loader = async ({ request }: LoaderArgs) => {
  const signup_link = signupLink()


  return json({ userId: await getUserId(request), signupLink : signup_link });
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col bg-gray-900 h-full">
        <Header userId={data.userId} signupLink={data.signupLink} />
        <Outlet />
        <Footer />
       
        <ScrollRestoration />
        <Scripts />
        <LiveReload />

       
       
      </body>
    </html>
  );
}
