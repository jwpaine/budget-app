import { Link, useMatches, NavLink } from "@remix-run/react";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';





import {
  Form,
  useCatch,
  useLoaderData,
  useActionData,
  useFetcher,
} from "@remix-run/react";
// import invariant from "tiny-invariant";
import * as React from "react";
import { getAccounts } from "~/models/account.server";
import { requireUserId, trialExpired } from "~/auth.server";

import { useOptionalUser } from "~/utils";

import NewTransactionPage from "../components/transactions/new";
import { getCategories } from "../models/category.server";
import { getDailyTransactionSums, getTransactions, getUncategorizedTransactions } from "~/models/transaction.server";
import { getUserById } from "~/models/user.server";
import { getUserId } from "~/auth.server"

// import Graph from "../../components/transactions/graph"



export async function action({ request, params }: ActionArgs) {

  console.log("post request received")

  const formData = await request.formData();

  const email = (formData.get("email") as string);
  const message = (formData.get("message") as string);

  console.log("Received: ", email, message)

  if(!email || !message) {
    return json({ error: "missing email or message" }, { status: 400 })
  }



  return null

}

export async function loader({ request, params }: LoaderArgs) {

  const userId = await getUserId(request)

  if (!userId) return json({ account: null })

  const account = await getUserById({ id: userId })
  return json({ account })


}

const chatBubble = ({ message, type}: { message: string, type?: string }) => {
  return <span className={`flex rounded p-2 border border-slate-400 w-full my-2 ${type == 'customer' ? 'text-white bg-blue-500' : 'text-slate-800'}`}>
    {message}
  </span>
}

export default function Help() {
  const user = useOptionalUser()
  const data = useLoaderData<typeof loader>();
  const [email, setEmail] = React.useState("")
  const [response, setResponse] = React.useState("")

  const [message, setMessage] = React.useState("")

  const deliverMessage = useFetcher()


  const sendMessage = () => {
    // send email to support

    console.log("sending message: ", response)
    console.log("Using email: ", data.account?.email || email)

    const r = deliverMessage.submit(
      {
        email: data.account?.email || email,
        message: response
      },
      { method: "post", action: "/help" }
    );

  }



  return (
    <main className="flex flex-col justify-center items-center">
      <h1 className="text-3xl text-white text-center">DollarGrad Help Center</h1>
      <section className="bg-white w-full max-w-2xl p-10 rounded">
        {chatBubble({ message: "👋 Thanks for reaching out to DollarGrad support. I'm a bot, but I'll deliver any questions you may have to our support team!" })}
        {data.account ? chatBubble({ message: `It looks like you're logged in! We'll follow up with you at ${data.account.email}` }) : (
          chatBubble({ message: `What's a good email that we can use to follow up with you?` })
        )}
        {data.account && chatBubble({ message: `What can we help you with?` })}
        {email && chatBubble({ message: email, type: "customer" })}
        {email && chatBubble({ message: `We'll follow up with you at ${email}. What can we help you with?` })}
        {message && chatBubble({ message: message, type: "customer" })}
        {message && chatBubble({ message: `Thanks for reaching out! We'll follow up with you at ${email} ASAP!` })}
        {!message && <div className="flex">
          <input type="text" value={response} onChange={(e) => setResponse(e.target.value)} />
          <button type="button" onClick={() => {
            if (!data.account && !email) {
              setEmail(response)
              setResponse("")
              return
            }
            setMessage(response)
            setResponse("")
            sendMessage()
          
          }}>Send</button>
        </div>}

      </section>
    </main>
  );
}

