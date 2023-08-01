import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link, useFetcher, useLoaderData, useMatches } from "@remix-run/react";
import * as React from "react";


import { addAccount, getAccounts } from "~/models/account.server";
import { requireUserId, trialExpired } from "~/auth.server";
import { getBudgets } from "~/models/budget.server";
import { getUserById } from "~/models/user.server";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getDailyTransactionSums } from "~/models/transaction.server";


export async function loader({ request, params }: LoaderArgs) {
    const userId = await requireUserId(request);

    const account = await getUserById({id: userId, budgets: true});
  
    if(await trialExpired({ account })) {
      return redirect("/account")
    }
 

    const user = await getBudgets({ userId });

  

    let currentDate = new Date() as Date
    currentDate.setDate(currentDate.getDate() - 30);
    let startDate = new Date(currentDate.toISOString().slice(0, 10)) as Date
  
    const accountId = "" as string
    const budgetId = account?.activeBudget as string
    const transactions = await getDailyTransactionSums({ userId, startDate, budgetId})
    const accounts = await getAccounts({ userId, budgetId });




    return json({ userId, account, accounts, transactions });
}

export const useRouteData = (routeId: string) => {
    const matches = useMatches()
    const data = matches.find((match) => match.id === routeId)?.data
  
    return data || undefined
  }

export default function Budgets() {

    
    const data = useLoaderData();


    
    const graphTransactions = () => {
        console.log('graphing transactions')
        if (!data.transactions) {
          console.log('no transactions')
          return
        }
    
        let cash = 0 as number
        let min = 999999 as number
        let max = 0 as number
    
        data.accounts.map((account) => {
          if (account.type != 'Loan') {
            //   console.log(`adding cash: ${account.balance}`)
            cash += Number(account.balance)
          }
        });
    
        const graph_data = []
    
        graph_data.push({ name: 'today', cash: cash })
    
        data.transactions.map((t) => {
          if (t.type == "R") return
          
          let sum = Number(t._sum.inflow) - Number(t._sum.outflow)
          cash = cash - sum
          cash = Number(cash.toFixed(2))
    
          if (max < cash) max = cash
          if (cash < min) min = cash

          console.log("Adding data point:", cash)
    
          let dataPoint = {
            name: new Date(t.date).toISOString().slice(0, 10),
            cash: cash
          }
          graph_data.push(dataPoint)
        })
    
        graph_data.reverse()
    
        console.log(`min: ${min}`)
        console.log(`max: ${max}`) // here
    
        return <ResponsiveContainer width="100%" height={150}>
        <LineChart
          width={500}
          height={200}
          data={graph_data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
         
          <XAxis dataKey="name" stroke="#FFFFFF" />
          <YAxis type="number" stroke="#FFFFFF" domain={[0, max]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#000000', color: '#FFFFFF' }} // Set the background and font color of the tooltip
          />
          <Legend />
          <Line type="monotone" dataKey="cash" stroke="#ccf2ff" activeDot={{ r: 8 }} dot={false}/>
         
        </LineChart>
      </ResponsiveContainer>
    
      }


    const renderActiveBudget = () => {
        if (data.account.budgets) {
            const activeBudget = data.account.budgets.find(budget => budget.id == data.account.activeBudget)
            if (activeBudget) {
                return activeBudget.name
            }
        }
        return
    }

    return (
        <main className="flex flex-col w-full items-center bg-gray-950 h-full">

            <h1 className="text-3xl text-white">Data for budget: {renderActiveBudget()}</h1>

            {/* <div className="flex h-200 m-2 ">
                {renderBudgetTotals()}
            </div> */}
            <div className="flex flex-col h-200 m-2 w-full mt-10">
                <span className="text-2xl text-white text-center">Total cash over time</span>
                {graphTransactions()}
            </div>



        </main>
    )
}