import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";


import { getUserId } from "~/auth.server";


export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/budget");
 
  return json({});
}


export default function Index() {
  // const user = useOptionalUser();
  return (
    <main className="flex flex-col h-full w-full">
      <section className="h-96 bg-slate-600">
        <div className="p-5">
          <h1 className="text-7xl text-white font-bold">Budgeting Made</h1>
          <h1 className="text-8xl text-white font-bold">Simple</h1>
          <h3 className="text-2xl text-white mt-5">Add Accounts. Create Categories. Track spending.</h3>
        </div>
        <div>
          
        </div>
      </section>
    </main>
  );
}
