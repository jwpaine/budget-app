import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";


import {  } from "~/auth.server";


export async function loader({ request }: LoaderArgs) {
  // const userId = await getUserId(request);
  // if (userId) return redirect("/accounts");
 
  return json({});
}


export default function Index() {
  // const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <h1>Main content!</h1>
    </main>
  );
}
