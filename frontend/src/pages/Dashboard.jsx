import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FiSearch, FiBell, FiPlus, FiMenu } from "react-icons/fi";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  ShoppingCart, Utensils, Car, Home, Film, HeartPulse, Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categoryMap = {
  Shopping:      { icon: <ShoppingCart size={16} />, bg: "bg-yellow-100", text: "text-yellow-600" },
  Food:          { icon: <Utensils size={16} />,     bg: "bg-orange-100", text: "text-orange-600" },
  Transport:     { icon: <Car size={16} />,          bg: "bg-blue-100",   text: "text-blue-600" },
  Housing:       { icon: <Home size={16} />,         bg: "bg-purple-100", text: "text-purple-600" },
  Entertainment: { icon: <Film size={16} />,         bg: "bg-pink-100",   text: "text-pink-600" },
  Health:        { icon: <HeartPulse size={16} />,   bg: "bg-red-100",    text: "text-red-600" },
  Income:        { icon: <Wallet size={16} />,       bg: "bg-green-100",  text: "text-green-600" },
};

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatRp(num) {
  return "Rp " + Number(num).toLocaleString("id-ID");
}

function BarChart({ data, maxVal }) {
  const chartH = 140;
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-300 text-sm">
        Belum ada data
      </div>
    );
  }
  const safeMax = maxVal > 0 ? maxVal : 1;

  return (
    <div className="flex items-end gap-1 h-40 w-full overflow-x-auto pb-1">
      {data.map((d, i) => {
        const incomeH  = Math.max(Math.round((d.income  / safeMax) * chartH), d.income  > 0 ? 3 : 0);
        const expenseH = Math.max(Math.round((d.expense / safeMax) * chartH), d.expense > 0 ? 3 : 0);
        return (
          <div key={i} className="flex flex-col items-center gap-0.5 flex-1 min-w-[28px] group relative">
            <div className="absolute bottom-6 hidden group-hover:flex flex-col items-center bg-gray-800 text-white text-[9px] rounded px-1.5 py-1 z-20 whitespace-nowrap shadow-lg pointer-events-none">
              <span className="text-green-300">In: {formatRp(d.income)}</span>
              <span className="text-red-300">Out: {formatRp(d.expense)}</span>
            </div>
            <div className="flex items-end gap-[2px] w-full justify-center">
              <div className="w-[45%] bg-green-400 hover:bg-green-500 rounded-t-sm transition-all duration-300 cursor-pointer" style={{ height: incomeH || 2 }} />
              <div className="w-[45%] bg-red-400 hover:bg-red-500 rounded-t-sm transition-all duration-300 cursor-pointer"   style={{ height: expenseH || 2 }} />
            </div>
            <span className="text-[8px] text-gray-400 truncate w-full text-center leading-tight">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch]     = useState("");
  const [chartMode, setChartMode] = useState("monthly");
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth());
  const filterYear = now.getFullYear();

  const user       = JSON.parse(localStorage.getItem("user") || "{}");
  const userName   = user?.name || "User";
  const userAvatar = localStorage.getItem("userAvatar") || null;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch {
        setTransactions([]);
      }
    };
    fetchTransactions();
  }, []);

  const currentMonth = now.getMonth();
  const currentYear  = now.getFullYear();
  let totalBalance = 0, monthlyIncome = 0, monthlyExpense = 0;
  transactions.forEach((t) => {
    const amount = Number(t.amount);
    const d      = new Date(t.date);
    totalBalance += t.type === "Income" ? amount : -amount;
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      if (t.type === "Income") monthlyIncome  += amount;
      else                     monthlyExpense += amount;
    }
  });

  // Monthly chart data
  const monthlyChartData = MONTH_NAMES.map((label, mIdx) => {
    let income = 0, expense = 0;
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d.getFullYear() === filterYear && d.getMonth() === mIdx) {
        if (t.type === "Income") income  += Number(t.amount);
        else                     expense += Number(t.amount);
      }
    });
    return { label, income, expense };
  });

  // Daily chart data
  const daysInMonth    = new Date(filterYear, filterMonth + 1, 0).getDate();
  const dailyChartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    let income = 0, expense = 0;
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d.getFullYear() === filterYear && d.getMonth() === filterMonth && d.getDate() === day) {
        if (t.type === "Income") income  += Number(t.amount);
        else                     expense += Number(t.amount);
      }
    });
    return { label: String(day), income, expense };
  });

  const chartData = chartMode === "monthly" ? monthlyChartData : dailyChartData;
  const maxVal    = Math.max(...chartData.map((d) => Math.max(d.income, d.expense)), 1);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const trxDate = new Date(dateString);
    const today   = new Date();
    trxDate.setHours(0,0,0,0); today.setHours(0,0,0,0);
    const diff     = (today - trxDate) / 86400000;
    const fullDate = trxDate.toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" });
    if (diff === 0) return `Today, ${fullDate}`;
    if (diff === 1) return `Yesterday, ${fullDate}`;
    return fullDate;
  };

  const filteredTransactions = transactions
    .filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return t.desc?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q);
    })
    .slice(0, 6);

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 bg-white rounded-lg shadow-sm text-gray-600"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="text-xl md:text-2xl font-semibold">Dashboard</h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <FiBell className="text-gray-500 text-xl" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, <strong>{userName}</strong></span>
              {userAvatar ? (
                <img src={userAvatar} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow" alt="avatar" />
              ) : (
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=1e3a8a`}
                  className="w-8 h-8 rounded-full"
                  alt="avatar"
                />
              )}
            </div>
          </div>
          
          {/* Mobile User Avatar */}
          <div className="md:hidden flex items-center gap-3">
             <FiBell className="text-gray-500 text-xl" />
             {userAvatar ? (
                <img src={userAvatar} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow" alt="avatar" />
              ) : (
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=1e3a8a`}
                  className="w-8 h-8 rounded-full"
                  alt="avatar"
                />
              )}
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] text-white p-6 rounded-2xl shadow flex flex-col justify-center">
            <p className="text-sm opacity-80 mb-1">Total Balance</p>
            <h2 className="text-3xl font-bold">{formatRp(totalBalance)}</h2>
            <p className="text-xs mt-3 opacity-70">{totalBalance >= 0 ? "Income > Expense" : "Expense > Income"}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow relative flex flex-col justify-center">
            <div className="absolute top-4 right-4 w-8 h-8 bg-green-100 rounded flex items-center justify-center">
              <ArrowDown size={16} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-400 mb-1">Monthly Income</p>
            <h2 className="text-3xl font-semibold text-green-600">{formatRp(monthlyIncome)}</h2>
            <p className="text-xs text-gray-400 mt-1">{MONTH_NAMES[currentMonth]} {currentYear}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow relative flex flex-col justify-center">
            <div className="absolute top-4 right-4 w-8 h-8 bg-red-100 rounded flex items-center justify-center">
              <ArrowUp size={16} className="text-red-600" />
            </div>
            <p className="text-sm text-gray-400 mb-1">Monthly Expense</p>
            <h2 className="text-3xl font-semibold text-red-500">{formatRp(monthlyExpense)}</h2>
            <p className="text-xs text-gray-400 mt-1">{MONTH_NAMES[currentMonth]} {currentYear}</p>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <p className="font-semibold text-gray-800">Expense vs Income</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {chartMode === "monthly"
                  ? `Per bulan — ${filterYear}`
                  : `${MONTH_NAMES[filterMonth]} ${filterYear} — per hari`}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-green-400 inline-block" /> Income
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" /> Expense
              </span>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button
                  onClick={() => setChartMode("monthly")}
                  className={`px-3 py-1.5 text-xs font-medium transition ${chartMode === "monthly" ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setChartMode("daily")}
                  className={`px-3 py-1.5 text-xs font-medium transition ${chartMode === "daily" ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  Daily
                </button>
              </div>
              {chartMode === "daily" && (
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(Number(e.target.value))}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
              )}
            </div>
          </div>
          <BarChart data={chartData} maxVal={maxVal} />
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold">Recent Transactions</p>
            <span onClick={() => navigate("/transactions")} className="text-blue-500 text-sm cursor-pointer hover:underline">
              View All
            </span>
          </div>
          {filteredTransactions.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No transactions found</p>
          ) : (
            filteredTransactions.map((t, i) => (
              <div key={t._id || i} className="flex items-center justify-between py-4 border-b last:border-none">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${categoryMap[t.category]?.bg || "bg-gray-100"} ${categoryMap[t.category]?.text || "text-gray-600"}`}>
                    {categoryMap[t.category]?.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{t.desc || t.category}</p>
                    <p className="text-sm text-gray-400">{t.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xs text-gray-400 whitespace-nowrap">{formatDate(t.date)}</p>
                  <p className={`font-semibold ${t.type === "Income" ? "text-green-500" : "text-red-500"}`}>
                    {t.type === "Income" ? "+" : "-"}{formatRp(t.amount)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/add-transaction")}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FiPlus />
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
