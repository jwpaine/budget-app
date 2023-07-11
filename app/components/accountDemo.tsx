


export default function AccountDemo() {
    return (
        <div className="flex flex-col flex-1">
        <header className="bg-slate-900">
          <div className="flex h-200 m-2 ">
            <h1 className="text-white">Test checking</h1>
          </div>
          <div className="flex h-200 m-2 ">
            <button className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-3 text-base font-medium shadow-sm hover:bg-slate-800 sm:px-8 mr-2" type="button">Reconcile</button>
            <button className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-3 text-base font-medium shadow-sm hover:bg-slate-800 sm:px-8 mr-2" type="button">Transfer</button>
            <button className="flex items-center justify-center rounded-md border border-slate-500 text-white px-4 py-3 text-base font-medium shadow-sm hover:bg-slate-800 sm:px-8 mr-2" type="button">Settings</button>
          </div>
        </header>
        <div className="flex flex-wrap justify-center bg-slate-500 p-2">
          <div className="lg:flex lg:flex-wrap grid grid-cols-2 gap-2 w-full justify-center">
            <input name="accountId" type="hidden" value="cljnbkfdw0008fq0qj7x4rksk" />
            <div className="flex flex-col">
              <span className="text-white text-center">Transaction Date</span>
              <input name="date" placeholder="Date" className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none " value="2023-07-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-center">Payee</span>
              <input name="payee" placeholder="Payee" className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none " value="" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-center">Category Name</span>
              <select name="category" className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none ">
                <option value="cljnbjf5w0007fq0qxlgu7les">🍺 Fun</option>
                <option value="cljnbjf5w0005fq0qm4lysli4">🥕 Grocery</option>
                <option value="cljnbjf5w0001fq0qolhczqi6">📱 Phone</option>
                <option value="cljnbjf5w0000fq0qkaza5nym">🏠 Mortgage</option>
                <option value="cljnbjf5w0002fq0q874frbha">🎥 Netflix</option>
                <option value="cljnbjf5w0004fq0qyg120y1t">🏋Gym</option>
                <option value="cljnbjf5w0003fq0qse1pw9hc">🚗 Auto</option>
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-center">Memo</span>
              <input name="memo" placeholder="Memo" className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none " value="" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-center">Inflow</span>
              <input name="inflow" placeholder="In" className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none " value="" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-center">Outflow</span>
              <input name="outflow" placeholder="Out" className="m-1 rounded p-1 bg-gray-300 text-black-primary placeholder-gray-800 focus:outline-none " value="" />
            </div>
          </div>
          <div className="flex flex-col w-full lg:flex-wrap lg:flex-row full-width justify-center mt-2 items-center">
            <button type="submit" className="w-full lg:w-40 rounded bg-gray-950 p-2 my-1 mx-1 text-white">Add Transaction</button>
          </div>
        </div>
        <div className="flex flex-col bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700 ">
          <div className="flex justify-between">
            <div>
              <span className="text-white text-s font-bold">Fi</span>
              <span className="ml-1 rounded order border-slate-400 bg-slate-700 p-1 mr-2 text-sm text-white">📱 Phone</span>
              <span className="text-xs text-slate-400 text-white"></span>
            </div>
            <span className="text-red-300">-120</span>
          </div>
          <div className="flex justify-between">
            <div>
              <span className="text-xs text-slate-100">2023-07-08</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700 ">
          <div className="flex justify-between">
            <div>
              <span className="text-white text-s font-bold">Harris Teeter</span>
              <span className="ml-1 rounded order border-slate-400 bg-slate-700 p-1 mr-2 text-sm text-white">🥕 Grocery</span>
              <span className="text-xs text-slate-400 text-white"></span>
            </div>
            <span className="text-red-300">-58.61</span>
          </div>
          <div className="flex justify-between">
            <div>
              <span className="text-xs text-slate-100">2023-07-05</span>
            </div>
          </div>
        </div>
      
        <div className="flex flex-col bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700 ">
          <div className="flex justify-between">
            <div>
              <span className="text-white text-s font-bold">Geico</span>
              <span className="ml-1 rounded order border-slate-400 bg-slate-700 p-1 mr-2 text-sm text-white">🚗 Auto</span>
              <span className="text-xs text-slate-400 text-white"></span>
            </div>
            <span className="text-red-300">-99</span>
          </div>
          <div className="flex justify-between">
            <div>
              <span className="text-xs text-slate-100">2023-07-05</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-gray-800 hover:bg-gray-700 p-2 border border-b border-slate-700 ">
          <div className="flex justify-between">
            <div>
              <span className="text-white text-s font-bold">AppleBees</span>
              <span className="ml-1 rounded order border-slate-400 bg-slate-700 p-1 mr-2 text-sm text-white">🍺 Fun</span>
              <span className="text-xs text-slate-400 text-white">Girls Night</span>
            </div>
            <span className="text-red-300">-50</span>
          </div>
          <div className="flex justify-between">
            <div>
              <span className="text-xs text-slate-100">2023-07-05</span>
            </div>
          </div>
        </div>


      </div>
    )
}