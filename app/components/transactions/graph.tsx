import { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/auth.server";

import { getTransactions } from "~/models/transaction.server";


export default function Graph(props) {
    const userId = props.userId

    // Get all transactions over the last 30 days
    let currentDate = new Date() as Date
    currentDate.setDate(currentDate.getDate() - 30);
    let startDate = new Date(currentDate.toISOString().slice(0, 10)) as Date

    const accountId = "clhr1krrd000otg7gcd9sqkve"
    

    const transactions = getTransactions({userId, startDate, accountId})
    return(
        <>
            transactions:
        </>
    )
}