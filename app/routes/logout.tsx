import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout, logout_AD } from "~/session.server";

export async function action({ request }: ActionArgs) {
 // return logout(request);
  return logout_AD(request)
}

export async function loader({request} : LoaderArgs) {
 // return redirect("/");
 return logout_AD(request)
}
