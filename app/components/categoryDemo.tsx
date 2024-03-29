


export default function CategoryDemo(props: any) {
    return (
        <section className="flex flex-col w-full flex-1 max-w-xl">
            
            {/* <h2 className="text-blue-400 text-3xl text-center p-2">Create Categories</h2> */}

            {/* <header >
               
                <div className="border-bottom my-0.5 flex flex-col pl-3 py-0.5">
                    <div className="flex justify-between">
                        <div className="flex flex-col w-40">
                            <span className="text-white text-s font-bold">Category</span>
                            <span className="text-xs text-white">Needed By Date</span>
                        </div>
                        <div className="grid grid-cols-4 w-full max-w-xl ">
                            <span className="flex flex-col justify-center text-right text-white text-sm mr-2"> Budgeted </span>
                            <span className="flex flex-col justify-center text-right text-white text-sm mr-2"> Spent </span>
                            <span className="flex flex-col justify-center text-right text-white text-sm mr-2"> Balance </span>
                            <span className="flex flex-col justify-center text-right text-white text-sm mr-2"> Needed </span>
                        </div>
                    </div>
                </div>
            </header> */}


            {/* <div className=" flex justify-between px-3 bg-gray-600 hover:bg-gray-500 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold">🏋 Gym</span>
                    <span className="text-xs text-white">2023-08-01</span>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl ">
                    <span className="flex flex-col justify-center text-right text-white">45</span>
                    <span className="flex flex-col justify-center text-right text-white">-45</span>
                    <span className="flex flex-col justify-center text-right false false text-white font-bold">0</span>
                    <span className="flex flex-col justify-center text-right text-white">45</span>
                </div>
            </div> */}

            <div className=" flex justify-between px-3 bg-gray-600 hover:bg-gray-500 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold">📱 Phone</span>
                    <span className="text-xs text-white">2023-08-15</span>
                </div>
                {props.values && <span className="text-2xl font-bold text-emerald-300">+90</span>}
            </div>

            <div className=" flex justify-between px-3 bg-gray-600 hover:bg-gray-500 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold">🏠 Rent</span>
                    <span className="text-xs text-white">2023-08-30</span>
                </div>
                {props.values && <span className="text-2xl font-bold text-emerald-300">+500</span>}
            </div>

            <div className=" flex justify-between px-3 bg-gray-600 hover:bg-gray-500 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold py-2">🥕 Grocery</span>
                    
                </div>
                {props.values && <span className="text-2xl font-bold text-emerald-300">+100</span>}
            </div>

            <div className=" flex justify-between px-3 bg-gray-600 hover:bg-gray-500 p-2 border border-b border-slate-700">
                <div className="flex flex-col w-40"><span className="text-white text-m font-bold py-2">🍺 Fun</span>
                 
                </div>
              
            </div>

      




           

        </section>
    )
}