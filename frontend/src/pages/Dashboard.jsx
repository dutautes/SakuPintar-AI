import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FiSearch, FiBell, FiPlus } from "react-icons/fi";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Film,
  HeartPulse,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categoryMap = {
  Shopping: { icon: <ShoppingCart size={16} />, bg: "bg-yellow-100", text: "text-yellow-600" },
  Food: { icon: <Utensils size={16} />, bg: "bg-orange-100", text: "text-orange-600" },
  Transport: { icon: <Car size={16} />, bg: "bg-blue-100", text: "text-blue-600" },
  Housing: { icon: <Home size={16} />, bg: "bg-purple-100", text: "text-purple-600" },
  Entertainment: { icon: <Film size={16} />, bg: "bg-pink-100", text: "text-pink-600" },
  Health: { icon: <HeartPulse size={16} />, bg: "bg-red-100", text: "text-red-600" },
  Income: { icon: <Wallet size={16} />, bg: "bg-green-100", text: "text-green-600" },
};

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("DATA DASHBOARD:", data);

      // 🔥 biar ga error
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        setTransactions([]);
      }

    } catch (err) {
      console.log("Error:", err);
      setTransactions([]);
    }
  };

  fetchTransactions();
}, []);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let totalBalance = 0;
  let monthlyIncome = 0;
  let monthlyExpense = 0;

  transactions.forEach((t) => {
    const amount = Number(t.amount);
    const trxDate = new Date(t.date);
    totalBalance += t.type === "Income" ? amount : -amount;

    if (trxDate.getMonth() === currentMonth && trxDate.getFullYear() === currentYear) {
      if (t.type === "Income") monthlyIncome += amount;
      else monthlyExpense += amount;
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const trxDate = new Date(dateString);
    const today = new Date();
    trxDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today - trxDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const fullDate = trxDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (diffDays === 0) return `Today, ${fullDate}`;
    if (diffDays === 1) return `Yesterday, ${fullDate}`;
    return fullDate;
  };

  // FILTER TRANSACTIONS BERDASARKAN SEARCH
  const filteredTransactions = transactions
    .filter((t) => {
      if (!search) return true;
      const lowerSearch = search.toLowerCase();
      return (
        (t.desc && t.desc.toLowerCase().includes(lowerSearch)) ||
        (t.category && t.category.toLowerCase().includes(lowerSearch))
      );
    })
    .slice(0, 6);

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
          {/* TOTAL BALANCE */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] text-white p-6 rounded-2xl shadow flex flex-col justify-center relative">
            <p className="text-sm opacity-80 mb-1">Total Balance</p>
            <h2 className="text-3xl font-bold">
              Rp {totalBalance.toLocaleString("id-ID")}
            </h2>
            <p className="text-xs mt-3 opacity-70">
              {totalBalance >= 0 ? "+Income > Expense" : "-Expense > Income"}
            </p>
          </div>

          {/* MONTHLY INCOME */}
          <div className="bg-white p-6 rounded-2xl shadow relative flex flex-col justify-center">
            <div className="absolute top-4 right-4 w-8 h-8 bg-green-100 rounded flex items-center justify-center">
              <ArrowDown size={16} className="text-green-600 transform rotate-45" />
            </div>
            <p className="text-sm text-gray-400 mb-1 text-left">Monthly Income</p>
            <h2 className="text-3xl font-semibold text-left">
              Rp {monthlyIncome.toLocaleString("id-ID")}
            </h2>
          </div>

          {/* MONTHLY EXPENSE */}
          <div className="bg-white p-6 rounded-2xl shadow relative flex flex-col justify-center">
            <div className="absolute top-4 right-4 w-8 h-8 bg-red-100 rounded flex items-center justify-center">
              <ArrowUp size={16} className="text-red-600 transform rotate-45" />
            </div>
            <p className="text-sm text-gray-400 mb-1 text-left">Monthly Expense</p>
            <h2 className="text-3xl font-semibold text-left">
              Rp {monthlyExpense.toLocaleString("id-ID")}
            </h2>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
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

        {/* RECENT TRANSACTIONS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold">Recent Transactions</p>
            <span
              onClick={() => navigate("/transactions")}
              className="text-blue-500 text-sm cursor-pointer"
            >
              View All
            </span>
          </div>
          <div>
            {filteredTransactions.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No transactions found</p>
            ) : (
              filteredTransactions.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-4 border-b last:border-none"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl
                      ${categoryMap[t.category]?.bg || "bg-gray-100"}
                      ${categoryMap[t.category]?.text || "text-gray-600"}`}
                    >
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
                      {t.type === "Income" ? "+" : "-"}Rp {Number(t.amount).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FLOAT BUTTON */}
        <button
          onClick={() => navigate("/add-transaction")}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          <FiPlus />
        </button>
      </div>
    </div>
  );
}

export default Dashboard;