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
    <main className="flex flex-col bg-gray-950 w-full h-full ">
      <section className="flex flex-col lg:flex-row justify-center">
        <div className="pb-5">
          <h1 className="text-7xl text-white font-bold">Budgeting </h1>
          <h1 className="text-4xl text-white mt-5 font-bold">Made</h1>
          <h1 className="text-8xl text-white mt-5 font-bold">Simple</h1>
        </div>
        <CategoryDemo />
      </section>




      {/* 
        <AccountDemo /> */}

    </main>
  );
}
