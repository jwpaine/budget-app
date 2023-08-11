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


import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

import { ApplicationInsights } from "@microsoft/applicationinsights-web";

import { InsightsProvider } from './InsightsContext';

const insights = new ApplicationInsights({
  config: {
    connectionString: 'DOllarGrad',
    instrumentationKey: "6d20f6db-52f0-40f3-bbdc-a808a64bd349",
  }
});
insights.loadAppInsights();


import Header from "./components/Header"
import Footer from "./components/Footer"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },



];



export const loader = async ({ request }: LoaderArgs) => {
  const signup_link = signupLink()

  // track event using appInsights without properties:



  return json({ userId: await getUserId(request), signupLink: signup_link });
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
        <InsightsProvider insights={insights}>
          <Header userId={data.userId} signupLink={data.signupLink} />

          <Outlet />

          <Footer />
        </InsightsProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />



      </body>
    </html>
  );
}
