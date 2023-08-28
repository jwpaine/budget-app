import { Link, NavLink, useFetcher } from "@remix-run/react"
import { useInsights } from "~/InsightsContext";



export default function SideBar(props) {
    const accounts = props.accounts

    let insights = useInsights();

  


    // create async function called recordClick:
    const recordClick = async (name: string) => {
        // Track event only on the client side
        if (typeof window !== "undefined") {
            await insights.trackEvent({ name: name });
            // record username in insights if logged in:

        }
    };

    const renderAccountTotals = () => {




        let cash = 0 as number
        let debt = 0 as number



        if (!accounts || accounts.length == 0) {
            return { cash, debt }
        }


        accounts.map((account) => {
            if (account.type != 'Loan') {
                //   console.log(`adding cash: ${account.balance}`)
                cash += Number(account.balance)
            } else {
                //    console.log(`adding dept: ${account.balance}`)
                //  debt += Number(account.balance)
                // increase debt by absolute value of balance:
                debt += Math.abs(Number(account.balance))
            }


        });

        // set cash to two decimal places:
        cash = Math.round(cash * 1e2) / 1e2
        debt = Math.round(debt * 1e2) / 1e2

        return { cash, debt }
    }

    return (
        <section className={`w-full lg:h-full border-r border-gray-700 bg-gray-900 pb-4 md:max-w-sm min-w-sm`}>

            {accounts.length > 0 && <div className="mt-1 rounded m-2 ">
            <div className="rounded m-2 p-5 bg-slate-700"><p className="text-white text-center ">Select an account to manage transactions</p></div>
                {accounts.map((account) => (
                    <NavLink
                        key={account.id}
                        className={({ isActive }) =>
                            `align-between w-full block flex justify-between mb-1 px-4 py-2 hover:bg-slate-800`
                        }
                        to={`/accounts/${account.id}`}
                        onClick={() => recordClick("Account Clicked (sidebar)")}
                    >
                        <span className="text-m text-white">{account.name}</span>
                        <span
                            className={`${Number(account.balance) >= 0
                                ? "text-white"
                                : "text-red-500"
                                } text-m`}
                        >
                            {account.balance}
                        </span>
                    </NavLink>
                ))}
            </div>
            }

            <div className="rounded m-2 mb-0 bg-slate-700">
                <div className={`align-between w-full block flex justify-between mb-1 px-4 py-2 `}>
                    <span className="text-white text-md mr-2">
                        Available Cash:
                    </span>
                    <span className={`font-bold text-md ${renderAccountTotals().cash > 0 ? 'text-emerald-400' : 'text-white'}`}>${renderAccountTotals().cash}</span>
                </div>

                <div className={`align-between w-full block flex justify-between px-4 py-2 `}>
                    <span className="text-white text-md mr-2">
                        Debt:
                    </span>
                    <span className={`font-bold text-md ${renderAccountTotals().debt > 0 ? 'text-red-400' : 'text-white'}`}>${renderAccountTotals().debt}</span>
                </div>
            </div>

            {accounts.length == 0 && <div className="rounded m-2 p-5 bg-slate-700"><p className="text-white text-center">No Accounts added. Click 'Add Account' below to get started.</p></div>


            }

            <Link
                to="/accounts/new"
                className={`flex items-center justify-center rounded-md border border-slate-500 px-4 py-4 mt-10 mx-2 text-base font-medium shadow-sm ${accounts?.length == 0 ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-slate-800 text-white hover:bg-slate-700'}  sm:px-8`}
                onClick={() => recordClick("Add Account (sidebar)")}
            >
                + Add Account
            </Link>

            <Link
                to="/budgets"
                className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-4 mt-2 mx-2 text-base font-medium shadow-sm bg-slate-800 hover:bg-slate-700 sm:px-8"
                onClick={() => recordClick("Manage Budgets (sidebar)")}
            >
                Manage Budgets
            </Link>

            <Link
                to="/data"
                className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-4 mt-2 mx-2 text-base font-medium shadow-sm bg-slate-800 hover:bg-slate-700 sm:px-8"
                onClick={() => recordClick("Reports (sidebar)")}
            >Reports</Link>

        </section>
    )
}