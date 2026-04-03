import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";

import {
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Film,
  HeartPulse,
  Wallet,
  ChevronDown,
  Trash2,
} from "lucide-react";

const categoryMap = {
  Shopping: { icon: <ShoppingCart size={14} />, bg: "bg-yellow-100", text: "text-yellow-600" },
  Food: { icon: <Utensils size={14} />, bg: "bg-orange-100", text: "text-orange-600" },
  Transport: { icon: <Car size={14} />, bg: "bg-blue-100", text: "text-blue-600" },
  Housing: { icon: <Home size={14} />, bg: "bg-purple-100", text: "text-purple-600" },
  Entertainment: { icon: <Film size={14} />, bg: "bg-pink-100", text: "text-pink-600" },
  Health: { icon: <HeartPulse size={14} />, bg: "bg-red-100", text: "text-red-600" },
  Income: { icon: <Wallet size={14} />, bg: "bg-green-100", text: "text-green-600" },
};

const categoryList = ["All", "Shopping", "Food", "Transport", "Housing", "Entertainment", "Health", "Income"];

const dateOptions = [
  { label: "All Time", value: null },
  { label: "Last 3 Days", value: 3 },
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
];

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  const [openDate, setOpenDate] = useState(false);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/transactions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Gagal memuat transaksi");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus transaksi ini?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Gagal menghapus transaksi");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchCategory =
      !selectedCategory || selectedCategory === "All"
        ? true
        : t.category === selectedCategory;

    const matchSearch =
      (t.desc || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.category || "").toLowerCase().includes(search.toLowerCase());

    let matchDate = true;
    if (selectedDate?.value) {
      const today = new Date();
      const trxDate = new Date(t.date);
      const diffDays = (today - trxDate) / (1000 * 60 * 60 * 24);
      matchDate = diffDays <= selectedDate.value;
    }

    return matchCategory && matchSearch && matchDate;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const totalBalance = transactions.reduce(
    (acc, t) => acc + (t.type === "Income" ? Number(t.amount) : -Number(t.amount)),
    0
  );

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <Sidebar />

      <div className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Transactions</h1>
            <p className="text-sm text-gray-400 mt-1">
              Balance:{" "}
              <span className={totalBalance >= 0 ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                {totalBalance >= 0 ? "+" : ""}Rp {totalBalance.toLocaleString("id-ID")}
              </span>
            </p>
          </div>
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
                  onClick={() => { setOpenCategory(!openCategory); setOpenDate(false); }}
                  className="border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-600 flex items-center gap-2"
                >
                  {selectedCategory || "Category"}
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${openCategory ? "rotate-180" : ""}`} />
                </button>
                {openCategory && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md z-10">
                    {categoryList.map((cat, i) => (
                      <div
                        key={i}
                        onClick={() => { setSelectedCategory(cat); setOpenCategory(false); }}
                        className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-50 ${selectedCategory === cat ? "text-blue-600 font-semibold" : ""}`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DATE DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => { setOpenDate(!openDate); setOpenCategory(false); }}
                  className="border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-600 flex items-center gap-2"
                >
                  {selectedDate?.label || "All Time"}
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${openDate ? "rotate-180" : ""}`} />
                </button>
                {openDate && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md z-10">
                    {dateOptions.map((opt, i) => (
                      <div
                        key={i}
                        onClick={() => { setSelectedDate(opt); setOpenDate(false); }}
                        className={`px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm ${selectedDate?.value === opt.value ? "text-blue-600 font-semibold" : ""}`}
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
                <th className="text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t._id} className="border-t border-gray-100">
                    <td className="py-4">
                      <div className="font-medium text-gray-800">{t.desc || "-"}</div>
                    </td>
                    <td>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                        ${categoryMap[t.category]?.bg || "bg-gray-100"}
                        ${categoryMap[t.category]?.text || "text-gray-600"}`}
                      >
                        {categoryMap[t.category]?.icon}
                        <span>{t.category}</span>
                      </div>
                    </td>
                    <td className="text-gray-500">{formatDate(t.date)}</td>
                    <td className={`font-medium ${t.type === "Income" ? "text-green-500" : "text-red-500"}`}>
                      {t.type}
                    </td>
                    <td className="text-right font-semibold">
                      <span className={t.type === "Income" ? "text-green-500" : "text-red-500"}>
                        {t.type === "Income" ? "+" : "-"}Rp {Number(t.amount).toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-gray-300 hover:text-red-500 transition p-1"
                        title="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
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
