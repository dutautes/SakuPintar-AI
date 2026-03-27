import React from "react";
import Sidebar from "../components/Sidebar";

function Analytics() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-[#f5f7fb]">
        <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
        <p>Di sini bisa menampilkan grafik, laporan, dan analitik data pengguna.</p>
      </div>
    </div>
  );
}
 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Export Report
          </button>
        </div>

        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Spent (Rp)</p>
            <h2 className="text-xl font-bold">Rp767 jt</h2>
            <p className="text-green-500 text-sm">+12% vs last year</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Income (Rp)</p>
            <h2 className="text-xl font-bold">Rp1.39 M</h2>
            <p className="text-green-500 text-sm">+8% vs last year</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Avg Monthly Savings</p>
            <h2 className="text-xl font-bold">24%</h2>
            <p className="text-gray-400 text-sm">Target is 20%</p>
          </div>

          <div className="bg-blue-600 text-white p-4 rounded-xl shadow">
            <p className="text-sm">Top Category</p>
            <h2 className="text-xl font-bold">Housing</h2>
            <p className="text-sm">35% of total expenses</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          
          <div className="col-span-2 bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Spending Trend (2023)</h2>

            <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-end">
              <div className="w-full h-[60%] border-t-2 border-blue-500"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Expenses by Category</h2>

            <div className="flex flex-col items-center justify-center mb-4">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                <span className="font-bold">Rp759 jt</span>
              </div>
            </div>

            <ul className="text-sm space-y-2">
              <li className="flex justify-between">
                <span>Housing</span> <span>35%</span>
              </li>
              <li className="flex justify-between">
                <span>Food & Dining</span> <span>25%</span>
              </li>
              <li className="flex justify-between">
                <span>Transportation</span> <span>20%</span>
              </li>
              <li className="flex justify-between">
                <span>Entertainment</span> <span>20%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Analytics;
