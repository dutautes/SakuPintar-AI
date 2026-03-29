import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import {
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Film,
  HeartPulse,
  Wallet,
  ChevronDown,
} from "lucide-react";

const categoryMap = {
  Shopping: {
    icon: <ShoppingCart size={14} />,
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  Food: {
    icon: <Utensils size={14} />,
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
  Transport: {
    icon: <Car size={14} />,
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  Housing: {
    icon: <Home size={14} />,
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  Entertainment: {
    icon: <Film size={14} />,
    bg: "bg-pink-100",
    text: "text-pink-600",
  },
  Health: {
    icon: <HeartPulse size={14} />,
    bg: "bg-red-100",
    text: "text-red-600",
  },
  Income: {
    icon: <Wallet size={14} />,
    bg: "bg-green-100",
    text: "text-green-600",
  },
};

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const dateOptions = [
  { label: "Last 3 Days", value: 3 },
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
  ];

useEffect(() => {
  const token = localStorage.getItem("token");
console.log("TOKEN:", token);
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 penting
        },
      });

      const data = await res.json();
      console.log("DATA:", data); // debug

      setTransactions(data);
    } catch (err) {
      console.log("Error fetching transactions:", err);
    }
  };

  fetchTransactions();
}, []);

  const filteredTransactions = transactions.filter((t) => {
  const matchCategory =
    !selectedCategory || selectedCategory === "All"
      ? true
      : t.category === selectedCategory;

  const matchSearch =
    t.desc.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase());

    let matchDate = true;

    if (selectedDate?.value) {
    const today = new Date();
    const trxDate = new Date(t.date);

    const diffTime = today - trxDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    matchDate = diffDays <= selectedDate.value;
  }

 return matchCategory && matchSearch && matchDate;
});

const totalBalance = transactions.reduce((acc, t) => {
  if (t.type === "Income") {
    return acc + Number(t.amount);
  } else {
    return acc - Number(t.amount);
  }
}, 0);
  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <Sidebar />

      <div className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Transactions
          </h1>

          <button
            onClick={() => navigate("/add-transaction")}
            className="bg-[#0B1E4F] hover:bg-[#09163a] transition text-white px-6 py-2.5 rounded-xl shadow-sm"
          >
            + Add Transaction
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Search + Filter */}
          <div className="flex justify-between items-center mb-6">
            <input
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 w-[320px] focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <div className="flex gap-3">
              {/* CATEGORY DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setOpenCategory(!openCategory)}
                  className="border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-600 flex items-center gap-2"
                >
                  {selectedCategory || "Category"}

                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      openCategory ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openCategory && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md z-10">
                    {categoryList.map((cat, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setOpenCategory(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

             <div className="relative">
  <button
    onClick={() => setOpenDate(!openDate)}
    className="border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-600 flex items-center gap-2"
  >
    {selectedDate?.label || "Last 30 Days"}

    <ChevronDown
      size={16}
      className={`text-gray-400 transition-transform ${
        openDate ? "rotate-180" : ""
      }`}
    />
  </button>

  {openDate && (
    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md z-10">
      {dateOptions.map((opt, i) => (
        <div
          key={i}
          onClick={() => {
            setSelectedDate(opt);
            setOpenDate(false);
          }}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
        >
          {opt.label}
        </div>
      ))}
    </div>
  )}
</div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-left">
              <tr>
                <th className="pb-4 font-medium">Transaction</th>
                <th className="font-medium">Category</th>
                <th className="font-medium">Date</th>
                <th className="font-medium">Type</th>
                <th className="text-right font-medium">Amount</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    {/* Transaction */}
                    <td className="py-4">
                      <div className="font-medium text-gray-800">
                        {t.desc}
                      </div>
                      <div className="text-xs text-gray-400">
                        {t.date} • {t.time}
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                        ${
                          categoryMap[t.category]?.bg || "bg-gray-100"
                        }
                        ${
                          categoryMap[t.category]?.text || "text-gray-600"
                        }`}
                      >
                        {categoryMap[t.category]?.icon}
                        <span>{t.category}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="text-gray-500">{t.date}</td>

                    {/* Type */}
                    <td
                      className={`font-medium ${
                        t.type === "Income"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {t.type}
                    </td>

                    {/* Amount */}
                    <td className="text-right font-semibold">
                      <span
                        className={
                          t.type === "Income"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {t.type === "Income" ? "+" : "-"}Rp{" "}
                        {Number(t.amount).toLocaleString("id-ID")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;