import { AiFillWallet } from "react-icons/ai";
import { FiHome, FiCreditCard, FiPieChart, FiUser, FiSettings, FiSearch, FiBell, FiPlus } from "react-icons/fi";

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">

      {/*sidebar*/}
      <div className="w-64 bg-gradient-to-b from-[#0b1220] via-[#14213d] to-[#1f3a8a] text-white p-6 flex flex-col justify-between">

        <div>
          {/*logo*/}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white/10 p-2 rounded-lg">
              <AiFillWallet size={16} />
            </div>
            <h1 className="text-lg font-semibold">SakuPintar AI</h1>
          </div>

          {/* MENU */}
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl">
              <FiHome className="text-white" />
              Dashboard
            </li>

            <li className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer transition">
              <FiCreditCard />
              Transactions
            </li>

            <li className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer transition">
              <FiPieChart />
              Analytics
            </li>

            <li className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer transition">
              <FiUser />
              Profile
            </li>

            <li className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer transition">
              <FiSettings />
              Settings
            </li>
          </ul>
        </div>

        {/* USER */}
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/40" className="rounded-full" />
            <div>
              <p className="text-sm font-medium">Alex K.</p>
              <p className="text-xs text-gray-300">Pro Member</p>
            </div>
          </div>
          <span className="text-gray-300">›</span>
        </div>

      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 outline-none text-sm"
              />
            </div>

            <FiBell className="text-gray-500 text-xl" />

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome back,</span>
              <img src="https://i.pravatar.cc/32" className="rounded-full" />
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          {/* BALANCE */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] text-white p-6 rounded-2xl shadow relative">
            <p className="text-sm opacity-80">Total Balance</p>
            <h2 className="text-3xl font-bold mt-2">Rp209.000.000</h2>
            <p className="text-xs mt-3 opacity-70">+2.5% vs last month</p>
          </div>

          {/* INCOME */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Monthly Income</p>
                <h2 className="text-2xl font-semibold mt-2">Rp70.600.000</h2>
                <p className="text-xs text-gray-400 mt-1">Expected:Rp67.200.000</p>
              </div>
              <div className="bg-green-100 text-green-600 p-2 rounded-lg text-sm">↙</div>
            </div>
          </div>

          {/* EXPENSE */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Monthly Expense</p>
                <h2 className="text-2xl font-semibold mt-2">Rp31.080.000</h2>
                <p className="text-xs text-gray-400 mt-1">Budget: Rp42.000.000</p>
              </div>
              <div className="bg-red-100 text-red-500 p-2 rounded-lg text-sm">↗</div>
            </div>
          </div>

        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8 relative">
          <p className="mb-4 font-medium">Expense vs Income</p>

          <div className="flex items-end justify-between h-40 px-4">
            {[40, 60, 80, 100].map((h, i) => (
              <div key={i} className="flex gap-1 items-end">
                <div className="w-3 bg-green-400 rounded" style={{ height: h }}></div>
                <div className="w-3 bg-red-400 rounded" style={{ height: h - 20 }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* TRANSAKSI */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold">Recent Transactions</p>
            <span className="text-blue-500 text-sm cursor-pointer">View All</span>
          </div>

          <div className="space-y-0">

            {[
              { name: "Starbucks", type: "Food & Drink", icon: "☕", bg: "bg-red-100" },
              { name: "Apple Music", type: "Entertainment", icon: "🎵", bg: "bg-purple-100" },
              { name: "Salary", type: "Income", icon: "🎁", bg: "bg-green-100" },
              { name: "Uber", type: "Transport", icon: "🚗", bg: "bg-blue-100" },
              { name: "Amazon", type: "Shopping", icon: "🛍️", bg: "bg-pink-100" },
              { name: "Grocery Store", type: "Food & Drink", icon: "🛒", bg: "bg-orange-100" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-4 border-b last:border-none"
              >
                
                {/* ICON */}
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.bg}`}>
                  <span className="text-lg">{item.icon}</span>
                </div>

                {/* TEXT */}
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-400">{item.type}</p>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* FLOAT BUTTON */ }
        <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg">
          <FiPlus />
        </button>

      </div>
    </div>
  );
}

export default Dashboard;
