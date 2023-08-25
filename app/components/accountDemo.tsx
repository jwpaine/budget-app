


export default function AccountDemo() {
  return (
    <div className="flex flex-col w-full flex-1 max-w-xl">


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