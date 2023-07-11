


export default function CategoryDemo() {
    return (
        <section className="flex flex-col lg:max-w-lg w-full">
            
            {/* <h2 className="text-blue-400 text-3xl text-center p-2">Create Categories</h2> */}

            <header >
               
                <div className="border-bottom my-0.5 flex flex-col px-3 py-0.5">
                    <div className="flex justify-between">
                        <div className="flex flex-col w-40">
                            <span className="text-white text-s font-bold">Category</span>
                            <span className="text-xs text-white">Needed By Date</span>
                        </div>
                        <div className="grid grid-cols-4 w-full max-w-xl ">
                            <span className="flex flex-col justify-center text-right text-white"> Budgeted </span>
                            <span className="flex flex-col justify-center text-right text-white"> Activity </span>
                            <span className="flex flex-col justify-center text-right text-white"> Balance </span>
                            <span className="flex flex-col justify-center text-right text-white"> Needed </span>
                        </div>
                    </div>
                </div>
            </header>
            <div className=" flex justify-between px-3 bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40">
                    <span className="text-white text-m font-bold">🏋Gym</span>
                    <span className="text-xs text-white">2023-07-01</span>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">0.00</span>
                    <span className="flex flex-col justify-center text-right text-white">0.00</span>
                    <span className="flex flex-col justify-center text-right text-white false false">0.00</span>
                    <span className="flex flex-col justify-center text-right text-white">90</span>
                </div>
            </div>
            <div className=" flex justify-between px-3 bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40">
                    <span className="text-white text-m font-bold">🚗 Auto</span>
                    <span className="text-xs text-white">2023-07-14</span>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">99.00</span>
                    <span className="flex flex-col justify-center text-right text-white">-99.00</span>
                    <span className="flex flex-col justify-center text-right text-white false false">0.00</span>
                    <span className="flex flex-col justify-center text-right text-white">90.00</span>
                </div>
            </div>

            <div className=" flex justify-between px-3 bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold">🍺 Fun</span>
                    <span className="text-xs text-white">2023-07-15</span>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">50.00</span>
                    <span className="flex flex-col justify-center text-right text-white">-75.00</span>
                    <span className="flex flex-col justify-center text-right false false text-red-400 font-bold border-l-4 border-red-400">-25.00</span>
                    <span className="flex flex-col justify-center text-right text-white">50.00</span>
                </div>

            </div>

            <div className=" flex justify-between px-3 bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold">📱 Phone</span>
                    <span className="text-xs text-white">2023-07-15</span>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">120.00</span>
                    <span className="flex flex-col justify-center text-right text-white">-120.00</span>
                    <span className="flex flex-col justify-center text-right text-white false false">0.00</span>
                    <span className="flex flex-col justify-center text-right text-white">120.00</span>
                </div>

            </div>

            <div className=" flex justify-between px-3 bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold">🥕 Grocery</span>
                    <span className="text-xs text-white">2023-07-30</span>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">58.61</span>
                    <span className="flex flex-col justify-center text-right text-white">-58.61</span>
                    <span className="flex flex-col justify-center text-right text-white false false">0.00</span>
                    <span className="flex flex-col justify-center text-right text-white">300.00</span>
                </div>

            </div>


            <div className=" flex justify-between px-3 bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold">🏡 Mortgage</span>
                    <span className="text-xs text-white">2023-07-15</span>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">500</span>
                    <span className="flex flex-col justify-center text-right text-white">0</span>
                    <span className="flex flex-col justify-center text-right false false text-emerald-300 font-bold border-l-4 border-emerald-300">500</span>
                    <span className="flex flex-col justify-center text-right text-white">1200</span>
                </div>

            </div>

           

        </section>
    )
}