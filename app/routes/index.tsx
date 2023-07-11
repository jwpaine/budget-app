import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

// import {Button} from "../components/Button"

import { getUserId } from "~/auth.server";

import CategoryDemo from "~/components/categoryDemo";
import AccountDemo from "~/components/accountDemo";


export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/budget");

  return json({});
}


export default function Index() {
  // const user = useOptionalUser();
  return (
    <main className="flex justify-center bg-gray-950 w-full h-full flex-col lg:flex-row">
      <section className="flex flex-col p-5 ">
        <h1 className="text-7xl text-white font-bold">Budgeting Made</h1>
        <h1 className="text-8xl mg:text-9xl text-white font-bold">Simple</h1>

      </section>

      <CategoryDemo />

      

      {/* 
        <AccountDemo /> */}

    </main>
  );
}
