import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Film,
  HeartPulse,
  ChevronDown,
  LayoutGrid
} from "lucide-react";

const categories = [
  { name: "Shopping", icon: <ShoppingCart size={18} /> },
  { name: "Food", icon: <Utensils size={18} /> },
  { name: "Transport", icon: <Car size={18} /> },
  { name: "Housing", icon: <Home size={18} /> },
  { name: "Entertainment", icon: <Film size={18} /> },
  { name: "Health", icon: <HeartPulse size={18} /> },
];

function AddTransaction() {
  const navigate = useNavigate();

  const [type, setType] = useState("Expense");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false); // ✅ FIX

  const handleSave = () => {
    if (!amount || !category) {
      alert("Isi data dulu!");
      return;
    }

    const oldData = JSON.parse(localStorage.getItem("trx")) || [];

    const newData = [
      {
        type,
        amount,
        desc,
        category,
        date,
        time,
      },
      ...oldData,
    ];

    localStorage.setItem("trx", JSON.stringify(newData));
    navigate("/transactions");
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <Sidebar />

      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white w-[420px] p-8 rounded-2xl shadow-md">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-gray-800">
              New Transaction
            </h2>
            <button onClick={() => navigate("/transactions")}>✕</button>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              className={`flex-1 py-2 rounded-lg ${
                type === "Expense"
                  ? "bg-white shadow text-red-500"
                  : "text-gray-500"
              }`}
              onClick={() => setType("Expense")}
            >
              Expense
            </button>

            <button
              className={`flex-1 py-2 rounded-lg ${
                type === "Income"
                  ? "bg-white shadow text-green-500"
                  : "text-gray-500"
              }`}
              onClick={() => setType("Income")}
            >
              Income
            </button>
          </div>

          {/* Amount Display */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-400">Enter Amount</p>
            <h1 className="text-3xl font-semibold">
              Rp {Number(amount || 0).toLocaleString("id-ID")}
            </h1>
          </div>

          {/* CATEGORY DROPDOWN  */}
       <div className="mb-6">
  <p className="text-sm text-gray-400 mb-2">Category</p>

  <div className="relative">
    <button
      onClick={() => setOpen(!open)}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between bg-white hover:border-gray-300 transition"
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* ICON BOX */}
        <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-xl">
          {category
            ? categories.find((c) => c.name === category)?.icon
            : <LayoutGrid size={18} className="text-gray-400" />
          }
        </div>

        {/* TEXT */}
        <span
          className={`text-sm ${
            category ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {category || "Select a category"}
        </span>
      </div>

      {/* RIGHT ICON */}
      <ChevronDown
        size={20}
        className={`text-gray-400 transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>

    {/* DROPDOWN */}
    {open && (
      <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() => {
              setCategory(cat.name);
              setOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition
              ${
                category === cat.name
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
          >
            {/* ICON BOX */}
            <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-xl">
              {cat.icon}
            </div>

            <span className="text-sm text-gray-700">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
          {/* Date & Time */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">Date</p>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">Time</p>
              <input
                type="time"
                className="w-full border border-gray-200 rounded-xl px-3 py-2"
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
        <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Description</p>
        <input
            type="text"
            placeholder="What was this for?"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            onChange={(e) => setDesc(e.target.value)}
        />
        </div>
          {/* Amount Input */}
          <input
            type="number"
            placeholder="Amount"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-6"
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/transactions")}
              className="flex-1 border rounded-xl py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex-1 bg-[#0B1E4F] text-white rounded-xl py-2"
            >
              Save Transaction
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddTransaction;