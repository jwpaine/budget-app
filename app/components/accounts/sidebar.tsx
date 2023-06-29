import { Link, NavLink } from "@remix-run/react"



export default function SideBar(props) {
    const accounts = props.accounts
    return (
        <section className={`w-full  border-r bg-sky-700 md:max-w-sm min-w-sm`}>

            {accounts.length > 0 && <>
                    {accounts.map((account) => (
                        <NavLink
                            key={account.id}
                            className={({ isActive }) =>
                                `align-between w-full block flex justify-between p-2 hover:bg-sky-800`
                            }
                            to={`/accounts/${account.id}`}
                        >
                            <span className="text-m text-white">{account.name}</span>
                            <span
                                className={`${Number(account.balance) >= 0
                                    ? "text-white"
                                    : "rounded bg-gray-100 p-1 text-red-500"
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
                className="align-between flex justify-between p-2 text-xl text-white hover:bg-sky-800"
            // onClick={() => setAccountsBarOpen(false)}
            >
                + Add Account
            </Link>
        </section>
    )
}