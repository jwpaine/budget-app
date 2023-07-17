import { Link, NavLink, useFetcher } from "@remix-run/react"



export default function SideBar(props) {
    const accounts = props.accounts

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

            <div className={`align-between w-full block flex justify-between mb-1 px-4 py-2 `}>
                <span className="text-white text-md mr-2">
                    Available Cash:
                </span>
                <span className={`font-bold text-md ${renderAccountTotals().cash > 0 ? 'text-emerald-400' : 'text-white'}`}>${renderAccountTotals().cash}</span>
            </div>

            <div className={`align-between w-full block flex justify-between mb-1 px-4 py-2 `}>
                <span className="text-white text-md mr-2">
                    Debt:
                </span>
                <span className={`font-bold text-md ${renderAccountTotals().debt > 0 ? 'text-red-400' : 'text-white'}`}>${renderAccountTotals().debt}</span>
            </div>

            {accounts.length > 0 && <div className="mt-5 border-t border-gray-700">
                {accounts.map((account) => (
                    <NavLink
                        key={account.id}
                        className={({ isActive }) =>
                            `align-between w-full block flex justify-between mb-1 px-4 py-2 hover:bg-slate-800`
                        }
                        to={`/accounts/${account.id}`}
                    >
                        <span className="text-m text-white">{account.name}</span>
                        <span
                            className={`${Number(account.balance) >= 0
                                ? "text-white"
                                : "p-1 text-red-500"
                                } text-m`}
                        >
                            {account.balance}
                        </span>
                    </NavLink>
                ))}
            </div>
            }



            <Link
                to="/accounts/new"
                className={`flex items-center justify-center rounded-md border border-slate-500 px-4 py-1 mt-5 mx-4 text-base font-medium shadow-sm ${accounts?.length == 0 ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-slate-800 text-white hover:bg-slate-700'}  sm:px-8`}
            >
                + Add Account
            </Link>

            <Link
                to="/budgets"
                className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-1 mt-5 mx-4 text-base font-medium shadow-sm bg-slate-800 hover:bg-slate-700 sm:px-8"
            >
                Manage Budgets
            </Link>

            <Link
                to="/data"
                className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-1 mt-5 mx-4 text-base font-medium shadow-sm bg-slate-800 hover:bg-slate-700 sm:px-8"
            >Reports</Link>

        </section>
    )
}