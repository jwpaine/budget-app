import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, NavLink, useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { authorize } from "~/auth.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";



export async function loader({ request }: LoaderArgs) {

    let redirectOriginal = "/"

    return authorize({ request, redirectOriginal });

    // const url = new URL(request.url)
    // const code = url.searchParams.get('code')

    // let r = await authorize({ request, redirectOriginal });
    // // if r is a redirect, return r, other wise return json:
    // if (r?.status == 302) {
    //     return r
    // }
    // return ({ code: code })
}

// export default function Auth() {

//     const data = useLoaderData();
//     const code = data.code

//     const consent = () => {
//         // add &consent=true to the request url:
//         return redirect(`/auth?code=${code}&consent=true`)
//     }

//     return (
//         <main className="flex flex-col w-full items-center bg-gray-950 h-full">
//             <h1 className="text-white text-xl">Welcome to DollarGrad. The easiest way to build a budget!</h1>
//             <h2 className="text-white text-xl">By clicking continue, you acknowledge that you've read and agreed to both our privacy policy and terms of conditions</h2>
//             {/* <link className="text-white text-xl" onClick={() => consent()}>Continue</button> */}
//             <NavLink
//                 to={`/auth?code=${code}&consent=true`}
//                 className="text-white text-xl"
//             >
//                 Continue
//             </NavLink>
//         </main>
//     )


// }
