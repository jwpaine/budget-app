import { Link, NavLink } from "@remix-run/react"



export default function SideBar(props) {
    const accounts = props.accounts
    return (
        <section className={`w-full lg:h-full border-r border-gray-700 bg-gray-900 pb-4 md:max-w-sm min-w-sm`}>

            {accounts.length > 0 && <>
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
                </>
            }

            <Link
                to="/accounts/new"
                className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-1 mt-5 mx-4 text-base font-medium shadow-sm hover:bg-slate-800 sm:px-8"
            // onClick={() => setAccountsBarOpen(false)}
            >
                + Add Account
            </Link>
        </section>
    )
}