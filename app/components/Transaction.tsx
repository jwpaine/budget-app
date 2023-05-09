import { useFetcher } from "@remix-run/react";
// import Select from "react-virtualized-select";

import * as React from "react";

export default function Transaction(props) {

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


    const handleInputChange = () => {
        if (inRef.current) {
            const inflowValue = parseFloat(inRef.current.value);
            setUncategorized(inflowValue > 0);
        }
    };

    // const renderPayee = () => {
    //     return Array.from(new Array(1000), (_, index) => ({
    //         label: `Item ${index}`,
    //         value: index
    //       }));
    // }

    return props.active || props.new ? (
        <transaction.Form
            className="flex flex-wrap justify-center bg-sky-500 p-1"
            method="post"
            action={props.new ? "/transaction/new" : "/transaction/update"}
            onSubmit={() => props.handleFormSubmit()}
        >
            <input
                name="accountId"
                defaultValue={props.accountId}
                type="hidden"
            />
            {props.transaction && <input name="id" defaultValue={props.transaction.id} type="hidden" />}
            <input
                ref={dateRef}
                name="date"
                defaultValue={props.transaction ? new Date(props.transaction.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}
                placeholder="Date"
                className="m-1"
            />

            <input
                ref={payeeRef}
                name="payee"
                defaultValue={props.transaction ? props.transaction.payee : ""}
                placeholder="Payee"
                className="m-1"
            />

            {/* <Select options={renderPayee()} /> */}


            {/* || props.transaction.category == "" */}
            {uncategorized ? (
                <>
                    <span>Inflow: Uncategorized</span>
                </>
            ) : (
                <select name="category">
                    {
                        props.categories?.map((c) => {
                            return <option selected={props.transaction && props.transaction.category == c.id} value={c.id} key={c.id}>{c.name}</option>
                        })
                    }
                </select>
            )}


            <input
                ref={memoRef}
                name="memo"
                defaultValue={props.transaction ? props.transaction.memo : ""}
                placeholder="Memo"
                className="m-1"
            />

            <input
                ref={inRef}
                name="inflow"
                defaultValue={props.transaction ? props.transaction.inflow : ""}
                placeholder="In"
                className="m-1"
                onChange={() => handleInputChange()}
            />

            <input
                ref={outRef}
                name="outflow"
                defaultValue={props.transaction ? props.transaction.outflow : ""}
                placeholder="Out"
                className="m-1"
                onChange={() => handleInputChange()}
            />

            <button type="submit" className="rounded bg-sky-800 p-2 text-white">
                {props.transaction ? "Update Transaction" : "Add Transaction"}
            </button>
            {props.transaction && <button
                type="button"
                className="rounded bg-sky-800 p-2 text-white"
                onClick={() => props.onSubmit()}
            >
                Cancel
            </button>}
            {props.transaction && <transaction.Form method="post" action="/transaction/delete">
                <input name="transactionId" defaultValue={props.transaction.id} type="hidden" />
                <input
                    name="accountId"
                    defaultValue={props.accountId}
                    type="hidden"
                />
                <button
                    type="submit"
                    className="bg-red-400 px-2 py-1 text-slate-800"
                >
                    Delete
                </button>
            </transaction.Form>}
        </transaction.Form>
    ) : (
        <div
            className={`mb-0.5 flex flex-col px-3 py-0.5 ${Number(props.transaction.inflow) > 0 ? "bg-emerald-100 hover:bg-emerald-200" : "bg-slate-200 hover:bg-slate-300"} `}
            key={props.transaction.id}
            onClick={() => props.onClick()}
        >
            <div className="flex justify-between">
                <div>
                    <span className="text-slac-800 text-s font-bold">
                        {props.transaction.payee || "-"}
                    </span>

                    <span
                        className={`ml-1 rounded order border-slate-400 bg-white p-0.5 mr-2 text-sm text-black`}>
                        {/* {t.category} */}
                        {props.transaction.category == "" ? (
                            <span>Uncategorized</span>
                        ) : (
                            props.categories?.map((c) => {
                                return props.transaction.category == c.id && c.name
                                return <option selected={props.transaction.category == c.id} value={c.id} key={c.id}>{c.name}</option>
                            })
                        )}


                    </span>
                    <span className="text-xs text-slate-800">{props.transaction.memo}</span>
                </div>
                <span className={`text-black`}>
                    {Number(props.transaction.outflow) == 0 ? `+${props.transaction.inflow}` : `-${props.transaction.outflow}`}
                </span>
            </div>
            <div className="flex justify-between">
                <div>
                    <span className="text-xs text-slate-800">
                        {new Date(props.transaction.date).toISOString().slice(0, 10)}
                    </span>
                </div>
            </div>
        </div>
    )
}

