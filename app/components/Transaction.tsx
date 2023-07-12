import { useFetcher } from "@remix-run/react";
// import Select from "react-virtualized-select";

import * as React from "react";
import { D } from "vitest/dist/types-94cfe4b4";

interface Transaction {
    id: string;
    date: Date;
    payee: string;
    category: string;
    memo: string;
    inflow: number;
    outflow: number;
}

interface TransactionProps {

    transaction: Transaction;
    accountId: string;
    categories: any;
    active: boolean;
    new: boolean;
    onClick: () => void;
    onSubmit: () => void;
    handleFormSubmit: () => void;
    sortBy: (key: string, order: string) => void;


}


export default function Transaction(props: TransactionProps) {

    const dateRef = React.useRef<HTMLInputElement>(null);
    const payeeRef = React.useRef<HTMLInputElement>(null);
    const categoryRef = React.useRef<HTMLInputElement>(null);
    const memoRef = React.useRef<HTMLInputElement>(null);
    const inRef = React.useRef<HTMLInputElement>(null);
    const outRef = React.useRef<HTMLInputElement>(null);
    const updateInRef = React.useRef<HTMLInputElement>(null);
    const updateOutRef = React.useRef<HTMLInputElement>(null);
    const transaction = useFetcher();

    const [uncategorized, setUncategorized] = React.useState(props.transaction && props.transaction.inflow > 0);

    const formatDate = () => {
        const now = new Date();
        const dateParts = now.toLocaleDateString().split('/');
        const year = dateParts[2];
        const month = String(dateParts[0]).padStart(2, '0');
        const day = String(dateParts[1]).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    const handleInputChange = () => {
        if (inRef.current) {
            const inflowValue = parseFloat(inRef.current.value);
            setUncategorized(inflowValue > 0);
        }
    };

    return props.active || props.new ? (
        <transaction.Form
            className="flex flex-wrap justify-center bg-slate-500 p-2"
            method="post"
            action={props.new ? "/transaction/new" : "/transaction/update"}
            onSubmit={() => props.handleFormSubmit()}
        >
            <div className="lg:flex lg:flex-wrap grid grid-cols-2 gap-2 w-full justify-center">
                <input
                    name="accountId"
                    defaultValue={props.accountId}
                    type="hidden"
                />
                {props.transaction && <input name="id" defaultValue={props.transaction.id} type="hidden" />}

                <div className="flex flex-col">
                    <span className="text-white text-center">Transaction Date</span>
                    <input
                        ref={dateRef}
                        name="date"
                        defaultValue={props.transaction ? new Date(props.transaction.date).toISOString().slice(0, 10) : formatDate()}
                        placeholder="Date"
                        className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none "
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-white text-center">Payee</span>
                    <input
                        ref={payeeRef}
                        name="payee"
                        defaultValue={props.transaction ? props.transaction.payee : ""}
                        placeholder="Payee"
                        className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none "
                    />
                </div>

                <div className="flex flex-col">
                    <span className="text-white text-center">Category Name</span>
                    {uncategorized ? (
                        <input
                            defaultValue="Uncategorized"
                            placeholder="Category"
                            className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none "
                            disabled={true}
                        />
                    ) : (

                        <select name="category" className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none ">
                            {
                                props.categories?.map((c: any) => {
                                    return <option selected={props.transaction && props.transaction.category == c.id} value={c.id} key={c.id}>{c.name}</option>
                                })
                            }
                        </select>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-white text-center">Memo</span>
                    <input
                        ref={memoRef}
                        name="memo"
                        defaultValue={props.transaction ? props.transaction.memo : ""}
                        placeholder="Memo"
                        className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none "
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-white text-center">Inflow</span>
                    <input
                        ref={inRef}
                        name="inflow"
                        defaultValue={props.transaction ? props.transaction.inflow : ""}
                        placeholder="In"
                        className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none "
                        onChange={() => handleInputChange()}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-white text-center">Outflow</span>
                    <input
                        ref={outRef}
                        name="outflow"
                        defaultValue={props.transaction ? props.transaction.outflow : ""}
                        placeholder="Out"
                        className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none "
                        onChange={() => handleInputChange()}
                    />
                </div>
            </div>
            <div className="flex flex-col w-full lg:flex-wrap lg:flex-row full-width justify-center mt-2 items-center">
            <button type="submit" className="w-full lg:w-40 rounded bg-gray-950 p-2 my-1 mx-1 text-white">
                {props.transaction ? "Update Transaction" : "Add Transaction"}
            </button>
            {props.transaction && <button
                type="button"
                className="w-full lg:w-36  mx-1 rounded bg-slate-800 p-2 my-1 text-white"
                onClick={() => props.onSubmit()}
            >
                Cancel
            </button>}
            {props.transaction && <transaction.Form method="post" className="w-full lg:w-36 mx-1" action="/transaction/delete">
                <input name="transactionId" defaultValue={props.transaction.id} type="hidden" />
                <input
                    name="accountId"
                    defaultValue={props.accountId}
                    type="hidden"
                />
                <button
                    type="submit"
                    
                className="w-full rounded bg-red-500 p-2 my-1 text-white "
                >
                    Delete
                </button>
            </transaction.Form>}
            </div>
        </transaction.Form>
    ) : (
        // ${Number(props.transaction.inflow) > 0 ? "bg-emerald-100 hover:bg-emerald-200" : "bg-slate-200 hover:bg-slate-300"}
        <div





            className={`flex flex-col bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700 `}
            key={props.transaction.id}
            onClick={() => props.onClick()}
        >
            <div className="flex justify-between">
                <div>
                    <span className="text-white text-s font-bold">
                        {props.transaction.payee || "-"}
                    </span>

                    <span
                        className={`ml-1 rounded order border-slate-400 bg-slate-700 p-1 mr-2 text-sm text-white`}
                        // onClick={() => props.sortBy("category", "House")}
                        >
                         
                        {/* {t.category} */}
                        {props.transaction.category == "" ? (
                            <span className="text-white">Uncategorized</span>
                        ) : (
                            props.categories?.map((c) => {
                                return props.transaction.category == c.id && c.name
                                return <option selected={props.transaction.category == c.id} value={c.id} key={c.id}>{c.name}</option>
                            })
                        )}


                    </span>
                    <span className="text-xs text-slate-400 text-white">{props.transaction.memo}</span>
                </div>
                <span className={`${Number(props.transaction.outflow) == 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                    {Number(props.transaction.outflow) == 0 ? `+${props.transaction.inflow}` : `-${props.transaction.outflow}`}
                </span>
            </div>
            <div className="flex justify-between">
                <div>
                    <span className="text-xs text-slate-100">
                        {new Date(props.transaction.date).toISOString().slice(0, 10)}
                    </span>
                </div>
            </div>
        </div>
    )
}

