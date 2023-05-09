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

import tailwindStylesheetUrl from "~/styles/tailwind.css";
import { getUserId } from "~/auth.server";

import Header  from "./components/Header"
import Footer  from "./components/Footer"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ userId: await getUserId(request) });
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
      <body className="h-full">
        <Header userId={data.userId} />
        <Outlet />
        {/* <Footer /> */}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
       
      </body>
    </html>
  );
}
