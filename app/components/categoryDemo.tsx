


export default function CategoryDemo() {
    return (
        <section className="flex flex-col w-full flex-1 max-w-xl">
            
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
                            <span className="flex flex-col justify-center text-right text-white"> Spent </span>
                            <span className="flex flex-col justify-center text-right text-white"> Balance </span>
                            <span className="flex flex-col justify-center text-right text-white"> Needed </span>
                        </div>
                    </div>
                </div>
            </header>


            <div className=" flex justify-between px-3 bg-gray-600 hover:bg-gray-500 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold">🏋 Gym</span>
                    <span className="text-xs text-white">2023-08-01</span>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">45</span>
                    <span className="flex flex-col justify-center text-right text-white">-45</span>
                    <span className="flex flex-col justify-center text-right false false text-white font-bold">0</span>
                    <span className="flex flex-col justify-center text-right text-white">45</span>
                </div>
            </div>

            <div className=" flex justify-between px-3 bg-gray-600 hover:bg-gray-500 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold">📱 Phone</span>
                    <span className="text-xs text-white">2023-08-15</span>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">100</span>
                    <span className="flex flex-col justify-center text-right text-white">0</span>
                    <span className="flex flex-col justify-center text-right false false text-emerald-400 border-l-4 border-emerald-400">100</span>
                    <span className="flex flex-col justify-center text-right text-white">100</span>
                </div>
            </div>

            <div className=" flex justify-between px-3 bg-gray-600 hover:bg-gray-500 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold">🏠 Rent</span>
                    <span className="text-xs text-white">2023-08-30</span>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">600</span>
                    <span className="flex flex-col justify-center text-right text-white">0</span>
                    <span className="flex flex-col justify-center text-right false false text-orange-300 font-bold border-l-4 border-orange-300">600</span>
                    <span className="flex flex-col justify-center text-right text-white">1200</span>
                </div>
            </div>

            <div className=" flex justify-between px-3 bg-gray-600 hover:bg-gray-500 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold py-2">🥕 Grocery</span>
                    
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">200</span>
                    <span className="flex flex-col justify-center text-right text-white">-250</span>
                    <span className="flex flex-col justify-center text-right false false text-red-400 font-bold border-l-4 border-red-400">-50</span>
                    <span className="flex flex-col justify-center text-right text-white">200</span>
                </div>
            </div>

            <div className=" flex justify-between px-3 bg-gray-600 hover:bg-gray-500 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold py-2">🍺 Fun</span>
                 
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">63</span>
                    <span className="flex flex-col justify-center text-right text-white">-63</span>
                    <span className="flex flex-col justify-center text-right false false text-white ">0</span>
                    <span className="flex flex-col justify-center text-right text-white">0</span>
                </div>
            </div>

      




           

        </section>
    )
}