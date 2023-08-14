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
  console.log("post request received");

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  console.log("Received:", email, message);

  if (!email || !message) {
    return json({ error: "missing email or message" }, { status: 400 });
  }

  // send email using AWS SES:
  const AWS = require('aws-sdk');

  // Set up AWS configuration
  AWS.config.update({

    region: 'us-east-1'
  });

  var send_params = {
    Destination: { /* required */

      ToAddresses: [
        'jpaine@dollargrad.com',
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */

        Text: {
          Charset: "UTF-8",
          Data: `Customer email: ${email}. Message: ${message}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: 'noreply@dollargrad.com', /* required */
    ReplyToAddresses: [
      email,
      /* more items */
    ],
  };

  // Create the promise and SES service object
  var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(send_params).promise();

  // Handle promise's fulfilled/rejected states
  return sendPromise.then(
    function (data) {
      console.log(data.MessageId);
      return json({ success: true });
    }).catch(
      function (err) {
        console.error(err, err.stack);
        return json({ error: err.message }, { status: 500 });
      });


  // Create a new SES object

  // const ses = new AWS.SES({ apiVersion: '2010-12-01' });

  // // Parameters for sending the email
  // const email_params = {
  //   Destination: {
  //     ToAddresses: ['jpaine@dollargrad.com']
  //   },
  //   Message: {
  //     Body: {
  //       Text: {
  //         Data: `Customer email: ${email}. Message: ${message}`
  //       }
  //     },
  //     Subject: {
  //       Data: 'NEW SUPPORT REQUEST'
  //     }
  //   },
  //   Source: 'noreply@dollargrad.com'
  // };

  // try {
  //   // Send the email
  //   await ses.sendEmail(email_params).promise();
  //   console.log('Email sent successfully');
  //   return json({ success: true });
  // } catch (err) {
  //   console.log('Error sending email:', err);
  //   return json({ error: err.message }, { status: 500 });
  // }
}


export async function loader({ request, params }: LoaderArgs) {

  const userId = await getUserId(request)

  if (!userId) return json({ account: null })

  const account = await getUserById({ id: userId })
  return json({ account })


}

const chatBubble = ({ message, type }: { message: string, type?: string }) => {
  return <span className={`flex rounded p-2 border border-slate-400 w-full my-2 text-xl ${type == 'customer' ? 'text-white bg-blue-500' : 'text-slate-800 bg-white'}`}>
    {message}
  </span>
}

export default function Help() {
  const user = useOptionalUser()
  const data = useLoaderData<typeof loader>();
  const [email, setEmail] = React.useState("")
  const [response, setResponse] = React.useState("")

  const [message, setMessage] = React.useState("")
  const [tag, setTag] = React.useState("")

  const deliverMessage = useFetcher()


  function isValidEmail({email} : {email: string}) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }


  const sendMessage = () => {
    // send email to support

    console.log("Message: ", response)
    console.log("Using email: ", data.account?.email || email)
    console.log( `Subject: NEW SUPPORT REQUEST: ${tag}`)

    const r = deliverMessage.submit(
      {
        email: data.account?.email || email,
        subject: `NEW SUPPORT REQUEST: ${tag}`,
        message: response
      },
      { method: "post", action: "/help" }
    );

  }

  const renderInput = () => {
    if (!email && !data.account) return <div className="flex max-w-2xl w-full mt-1">
    <input
      className="rounded border border-sky-500 w-full p-2"
      type="text"
      value={response}
      onChange={(e) => setResponse(e.target.value)}
    />
    <button
     className={`rounded text-white p-2 ml-1 ${(!data.account && !isValidEmail({email: response})) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
      type="button"
      onClick={() => {
        if (!data.account && isValidEmail({email: response})) {
          setEmail(response);
          setResponse("");
        }
      }}
      disabled={!data.account && !isValidEmail({email: response})}
    >
      Send
    </button>
  </div>

    if (!message && tag) return <div className="flex max-w-2xl w-full mt-1">
      <input className="rounded border border-sky-500 w-full p-2" type="text" value={response} onChange={(e) => setResponse(e.target.value)} />
      <button className="rounded text-white bg-blue-500 p-2 ml-1" type="button" onClick={() => {
        setMessage(response)
        sendMessage()

      }}>Send</button>
    </div>

  }

  return (
    <main className="flex flex-col justify-center items-center">
      <h1 className="text-3xl text-white text-center my-10">DollarGrad Help Center</h1>
      <section className="bg-slate-200 w-full max-w-2xl p-5 rounded pb-20">
        {chatBubble({ message: "👋 Thanks for reaching out to DollarGrad support. I'm a bot, but I'll deliver any questions you may have to our support team!" })}
        {data.account ? chatBubble({ message: `It looks like you're logged in! We'll follow up with you at ${data.account.email}` }) : (
          chatBubble({ message: `What's a good email that we can use to follow up with you?` })
        )}
        {email && chatBubble({ message: email, type: "customer" })}
        {email && chatBubble({ message: `We'll follow up with you at ${email}. Select an option below to get started:` })}
        {data.account && chatBubble({ message: `What can we help you with? Select an option below to get started:` })}
        {tag == "" && (data.account || email) && (
          <>
            <button className="rounded text-white bg-blue-500 p-3 m-1" type="button" onClick={() => setTag("Billing")}>Billing</button>
            <button className="rounded text-white bg-blue-500 p-3 m-1" type="button" onClick={() => setTag("Login")}>Login</button>
            <button className="rounded text-white bg-blue-500 p-3 m-1" type="button" onClick={() => setTag("Budget")} >My Budget</button>
            <button className="rounded text-white bg-blue-500 p-3 m-1" type="button" onClick={() => setTag("Suggestion")} >Suggestions</button>
            <button className="rounded text-white bg-blue-500 p-3 m-1" type="button" onClick={() => setTag("Bug")} >Report a bug</button>
            <button className="rounded text-white bg-blue-500 p-3 m-1" type="button" onClick={() => setTag("Other")}>Other</button>

          </>
        )}
        {tag && chatBubble({ message: tag, type: "customer" })}
        {tag != "" && chatBubble({ message: `${tag}. Got it. Please provide a detailed message and our support team will reach back to you.` })}
        {message && chatBubble({ message: message, type: "customer" })}
        {message && deliverMessage?.data?.success && chatBubble({ message: `Message received! We'll follow up with you soon!` })}
        {deliverMessage?.data?.error && chatBubble({ message: `We encountered an error when attempting to deliver your message. Our support team has been made aware of the issue. Please try again later.` })}
        
        


      </section>

      {renderInput()}


    </main>
  );
}

