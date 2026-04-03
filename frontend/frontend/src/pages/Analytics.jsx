import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  // 🔹 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // 🔹 YEARS
  const years = [
    ...new Set(
      transactions.map((t) => new Date(t.date).getFullYear())
    ),
  ].sort((a, b) => b - a);

  // 🔹 FILTER
  const filtered = transactions.filter(
    (t) => new Date(t.date).getFullYear() === year
  );

  // 🔹 PREVIOUS YEAR 
  const prevYear = year - 1;

  const prevFiltered = transactions.filter(
    (t) => new Date(t.date).getFullYear() === prevYear
  );

  // 🔹 TOTAL
  const totalIncome = filtered
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = filtered
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // 🔹 PREVIOUS TOTAL 
  const prevIncome = prevFiltered
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const prevExpense = prevFiltered
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // 🔹 CALCULATE %
  const calcPercent = (current, previous) => {
    if (previous === 0) return null;
    return Math.round(((current - previous) / previous) * 100);
  };

  const incomeChange = calcPercent(totalIncome, prevIncome);
  const expenseChange = calcPercent(totalExpense, prevExpense);

  // 🔹 SAVINGS
  const savings =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;

  // 🔹 CATEGORY
  const categoryTotals = {};
  filtered.forEach((t) => {
    if (t.type === "Expense") {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + Number(t.amount);
    }
  });
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
  name,
  value,
  }));
  const COLORS = ["#2563eb", "#60a5fa", "#93c5fd", "#bfdbfe"];

  const topCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b] ? a : b
        )
      : "-";

      const topCategoryPercent =
  topCategory !== "-" && totalExpense > 0
    ? Math.round((categoryTotals[topCategory] / totalExpense) * 100)
    : null;

  // 🔹 MONTHLY
  const monthly = Array(12).fill(0);

  filtered.forEach((t) => {
    if (t.type === "Expense") {
      const m = new Date(t.date).getMonth();
      monthly[m] += Number(t.amount);
    }
  });

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const chartData = months.map((m, i) => ({
  name: m,
  value: monthly[i],
  }));

  const maxMonthly = Math.max(...monthly, 1);

  // 🔹 EXPORT
  const handleExport = () => {
    if (filtered.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    const detailData = filtered.map((t) => ({
      Description: t.desc,
      Category: t.category,
      Type: t.type,
      Amount: `Rp ${Number(t.amount).toLocaleString("id-ID")}`,
      Date: t.date,
    }));

    const summaryData = [
      { Metric: "Total Income", Value: `Rp ${totalIncome.toLocaleString("id-ID")}` },
      { Metric: "Total Expense", Value: `Rp ${totalExpense.toLocaleString("id-ID")}` },
      { Metric: "Savings", Value: `${savings}%` },
      { Metric: "Top Category", Value: topCategory },
    ];

    const workbook = XLSX.utils.book_new();

    const detailSheet = XLSX.utils.json_to_sheet(detailData);
    detailSheet["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 10 },
      { wch: 18 },
      { wch: 15 },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet["!cols"] = [
      { wch: 20 },
      { wch: 25 },
    ];

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    XLSX.utils.book_append_sheet(workbook, detailSheet, "Transactions");

    XLSX.writeFile(workbook, `Financial_Report_${year}.xlsx`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 bg-[#f5f7fb]">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Analytics</h1>

          <div className="flex gap-3">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-white px-4 py-2 rounded-lg text-sm shadow"
            >
              {years.length === 0 ? (
                <option>No Data</option>
              ) : (
                years.map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))
              )}
            </select>

            <button
              onClick={handleExport}
              className="bg-[#1f3a8a] hover:bg-[#3b82f6] text-white px-4 py-2 rounded-lg transition"
            >
              Export Report
            </button>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-6">

          {/* EXPENSE */}
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Spent</p>
            <h2 className="text-xl font-bold">
              Rp {totalExpense.toLocaleString("id-ID")}
            </h2>
            <p className={`text-sm ${
              expenseChange === null
                ? "text-gray-400"
                : expenseChange >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}>
              {expenseChange === null
                ? "No data last year"
                : `${expenseChange >= 0 ? "+" : ""}${expenseChange}% vs last year`}
            </p>
          </div>

          {/* INCOME */}
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Income</p>
            <h2 className="text-xl font-bold">
              Rp {totalIncome.toLocaleString("id-ID")}
            </h2>
            <p className={`text-sm ${
              incomeChange === null
                ? "text-gray-400"
                : incomeChange >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}>
              {incomeChange === null
                ? "No data last year"
                : `${incomeChange >= 0 ? "+" : ""}${incomeChange}% vs last year`}
            </p>
          </div>

          {/* SAVINGS */}
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Savings</p>
            <h2 className="text-xl font-bold">{savings}%</h2>
          </div>

            {/* CATEGORY */}
 <div className="bg-gradient-to-r from-[#14213d] to-[#3b82f6] text-white p-4 rounded-xl shadow">
    <p className="text-sm">Top Category</p>
    <h2 className="text-xl font-bold">{topCategory}</h2>

    <p className={`text-sm mt-1 ${
      topCategoryPercent === null
        ? "text-blue-200"
        : "text-white"
    }`}>
      {topCategoryPercent === null
        ? "No data"
        : `${topCategoryPercent}% of total expense`}
    </p>
  </div>
  </div>

        {/* CONTENT */}
        <div className="grid grid-cols-3 gap-4">

          {/* CHART */}
          <div className="col-span-2 bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">
              Spending Trend ({year})
            </h2>

            <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </div>

          {/* CATEGORY */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">
              Expenses by Category
            </h2>

           {totalExpense === 0 ? (
  <p className="text-gray-400 text-sm">
    No expense data
  </p>
) : (
  <>
    {/* DONUT CHART */}
    <div className="flex justify-center mb-4">
      <div className="relative">
        <PieChart width={180} height={180}>
          <Pie
            data={pieData}
            dataKey="value"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={3}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>

        {/* TEXT DI TENGAH */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400">Total</span>
          <span className="font-semibold text-sm">
            Rp {totalExpense.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>

    {/* LIST */}
    <ul className="text-sm space-y-2">
      {Object.entries(categoryTotals).map(([cat, val]) => {
        const percent = Math.round((val / totalExpense) * 100);

        return (
          <li key={cat} className="flex justify-between">
            <span>{cat}</span>
            <span>{percent}%</span>
          </li>
        );
      })}
    </ul>
  </>
)}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;