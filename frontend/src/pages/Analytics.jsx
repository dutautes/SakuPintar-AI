import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FiDownload, FiTrendingUp, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CATEGORY_COLORS = {
  Shopping:      { bg: "#FBBF24", light: "#FEF3C7" },
  Food:          { bg: "#F97316", light: "#FFEDD5" },
  Transport:     { bg: "#3B82F6", light: "#DBEAFE" },
  Housing:       { bg: "#8B5CF6", light: "#EDE9FE" },
  Entertainment: { bg: "#EC4899", light: "#FCE7F3" },
  Health:        { bg: "#EF4444", light: "#FEE2E2" },
  Other:         { bg: "#6B7280", light: "#F3F4F6" },
};

function formatRp(num) {
  if (num >= 1_000_000_000) return "Rp " + (num / 1_000_000_000).toFixed(1) + " M";
  if (num >= 1_000_000)     return "Rp " + (num / 1_000_000).toFixed(1) + " jt";
  if (num >= 1_000)         return "Rp " + (num / 1_000).toFixed(0) + " rb";
  return "Rp " + Number(num).toLocaleString("id-ID");
}
function formatRpFull(num) {
  return "Rp " + Number(num).toLocaleString("id-ID");
}

// Donut chart SVG
function DonutChart({ segments, total }) {
  const r = 56, cx = 70, cy = 70, stroke = 22;
  const circ = 2 * Math.PI * r;
  let cumulative = 0;
  return (
    <div className="relative flex items-center justify-center">
      <svg width={140} height={140} viewBox="0 0 140 140">
        {segments.length === 0 ? (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
        ) : (
          segments.map((seg, i) => {
            const portion = seg.pct / 100;
            const dash    = circ * portion;
            const gap     = circ - dash;
            const offset  = circ * (1 - cumulative);
            cumulative   += portion;
            return (
              <circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dasharray 0.5s ease" }}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
          })
        )}
      </svg>
      <div className="absolute text-center">
        <p className="text-[10px] text-gray-400 leading-tight">Total</p>
        <p className="text-xs font-bold text-gray-700 leading-tight">{formatRp(total)}</p>
      </div>
    </div>
  );
}

// Spending Trend line chart SVG
function TrendChart({ data, maxVal }) {
  const W = 600, H = 160, PAD = 24;
  const safeMax = maxVal > 0 ? maxVal : 1;
  if (data.every((d) => d.income === 0 && d.expense === 0)) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-300 text-sm">
        Belum ada data transaksi
      </div>
    );
  }
  const toY = (val) => PAD + (H - 2 * PAD) * (1 - val / safeMax);
  const toX = (i)   => PAD + (i / (data.length - 1)) * (W - 2 * PAD);

  const mkPath = (key) =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d[key])}`).join(" ");

  const mkArea = (key) => {
    const pts = data.map((d, i) => `${toX(i)},${toY(d[key])}`).join(" L");
    return `M${toX(0)},${H - PAD} L${pts} L${toX(data.length - 1)},${H - PAD} Z`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={PAD} x2={W - PAD} y1={PAD + (H - 2 * PAD) * (1 - f)} y2={PAD + (H - 2 * PAD) * (1 - f)}
          stroke="#F3F4F6" strokeWidth={1} />
      ))}
      {/* Area fills */}
      <path d={mkArea("income")}  fill="#BBF7D0" opacity={0.4} />
      <path d={mkArea("expense")} fill="#FECACA" opacity={0.4} />
      {/* Lines */}
      <path d={mkPath("income")}  fill="none" stroke="#22C55E" strokeWidth={2.5} strokeLinejoin="round" />
      <path d={mkPath("expense")} fill="none" stroke="#EF4444" strokeWidth={2.5} strokeLinejoin="round" />
      {/* X labels */}
      {data.map((d, i) => (
        <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fontSize={9} fill="#9CA3AF">
          {d.label}
        </text>
      ))}
      {/* Dots */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.income)}  r={3} fill="#22C55E" />
          <circle cx={toX(i)} cy={toY(d.expense)} r={3} fill="#EF4444" />
        </g>
      ))}
    </svg>
  );
}

function Analytics() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [trendYear, setTrendYear]       = useState(new Date().getFullYear());

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) { navigate("/"); return null; }
        return res.json();
      })
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── kalkulasi stats ──────────────────────────────────────────────────────
  let totalSpent = 0, totalIncome = 0;
  const categoryTotals = {};
  const monthlyMap     = {};  // { "YYYY-M": { income, expense } }

  transactions.forEach((t) => {
    const amount = Number(t.amount);
    const d      = new Date(t.date);
    const key    = `${d.getFullYear()}-${d.getMonth()}`;

    if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };

    if (t.type === "Income") {
      totalIncome += amount;
      monthlyMap[key].income += amount;
    } else {
      totalSpent += amount;
      monthlyMap[key].expense += amount;
      const cat = t.category || "Other";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
    }
  });

  // Avg monthly savings
  const monthKeys = Object.keys(monthlyMap);
  let totalSavings = 0;
  monthKeys.forEach((k) => {
    totalSavings += (monthlyMap[k].income - monthlyMap[k].expense);
  });
  const avgMonthlySavings = monthKeys.length > 0 ? totalSavings / monthKeys.length : 0;
  const avgSavingsPct     = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

  // Top category
  let topCategory = "-", topCategoryPct = 0;
  if (totalSpent > 0 && Object.keys(categoryTotals).length > 0) {
    topCategory    = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0];
    topCategoryPct = Math.round((categoryTotals[topCategory] / totalSpent) * 100);
  }

  // Category segments for donut
  const catEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const segments   = catEntries.map(([cat, val]) => ({
    cat,
    val,
    pct:   totalSpent > 0 ? Math.round((val / totalSpent) * 100) : 0,
    color: CATEGORY_COLORS[cat]?.bg || CATEGORY_COLORS.Other.bg,
  }));

  // Trend chart (monthly per year)
  const trendData = MONTH_NAMES.map((label, mIdx) => {
    let income = 0, expense = 0;
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d.getFullYear() === trendYear && d.getMonth() === mIdx) {
        if (t.type === "Income") income  += Number(t.amount);
        else                     expense += Number(t.amount);
      }
    });
    return { label, income, expense };
  });
  const trendMax = Math.max(...trendData.map((d) => Math.max(d.income, d.expense)), 1);

  // Available years
  const availableYears = [...new Set(transactions.map((t) => new Date(t.date).getFullYear()))].sort((a, b) => b - a);
  if (availableYears.length === 0) availableYears.push(new Date().getFullYear());

  const handleExport = () => {
    const rows = [["Date","Type","Category","Description","Amount"]];
    transactions.forEach((t) => {
      rows.push([
        new Date(t.date).toLocaleDateString("id-ID"),
        t.type,
        t.category,
        t.desc || "",
        Number(t.amount).toLocaleString("id-ID"),
      ]);
    });
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 bg-white rounded-lg shadow-sm text-gray-600"
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Analytics</h1>
              <p className="text-sm text-gray-400 mt-0.5">Ringkasan keuangan kamu</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            <FiDownload size={15} />
            Export CSV
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Total Spent (Rp)</p>
            <h2 className="text-xl font-bold text-gray-900">{formatRp(totalSpent)}</h2>
            <p className="text-[11px] text-gray-400 mt-1">Semua waktu</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Total Income (Rp)</p>
            <h2 className="text-xl font-bold text-green-600">{formatRp(totalIncome)}</h2>
            <p className="text-[11px] text-gray-400 mt-1">Semua waktu</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Avg Monthly Savings</p>
            <h2 className={`text-xl font-bold ${avgMonthlySavings >= 0 ? "text-blue-600" : "text-red-500"}`}>
              {formatRp(Math.abs(avgMonthlySavings))}
            </h2>
            <p className="text-[11px] text-gray-400 mt-1">
              {avgSavingsPct >= 0 ? `${avgSavingsPct}% dari income` : "Defisit tiap bulan"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-sm">
            <p className="text-xs opacity-80 mb-1">Top Category</p>
            <h2 className="text-xl font-bold">{topCategory}</h2>
            <p className="text-[11px] opacity-80 mt-1">
              {topCategoryPct}% dari total pengeluaran
            </p>
          </div>
        </div>

        {/* CHART + DONUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Spending Trend */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-blue-500" />
                <h2 className="font-semibold text-gray-800">Spending Trend</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Income
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Expense
                </span>
                <select
                  value={trendYear}
                  onChange={(e) => setTrendYear(Number(e.target.value))}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
                >
                  {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <TrendChart data={trendData} maxVal={trendMax} />
          </div>

          {/* Expenses by Category */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Expenses by Category</h2>
            {totalSpent === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-300 text-sm">
                Belum ada data pengeluaran
              </div>
            ) : (
              <>
                <DonutChart segments={segments} total={totalSpent} />
                <ul className="text-xs space-y-2.5 mt-4">
                  {segments.map((s) => (
                    <li key={s.cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="text-gray-700">{s.cat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{formatRp(s.val)}</span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[s.cat]?.light || "#F3F4F6", color: s.color }}
                        >
                          {s.pct}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Monthly breakdown table */}
        {monthKeys.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-5">
            <h2 className="font-semibold text-gray-800 mb-4">Monthly Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b">
                    <th className="text-left pb-2 font-medium">Bulan</th>
                    <th className="text-right pb-2 font-medium">Income</th>
                    <th className="text-right pb-2 font-medium">Expense</th>
                    <th className="text-right pb-2 font-medium">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {monthKeys
                    .sort((a, b) => {
                      const [ay, am] = a.split("-").map(Number);
                      const [by, bm] = b.split("-").map(Number);
                      return ay !== by ? by - ay : bm - am;
                    })
                    .slice(0, 12)
                    .map((key) => {
                      const [yr, mo] = key.split("-").map(Number);
                      const { income, expense } = monthlyMap[key];
                      const net = income - expense;
                      return (
                        <tr key={key} className="border-b last:border-0 hover:bg-gray-50 transition">
                          <td className="py-3 text-gray-700">{MONTH_NAMES[mo]} {yr}</td>
                          <td className="py-3 text-right text-green-600">{formatRpFull(income)}</td>
                          <td className="py-3 text-right text-red-500">{formatRpFull(expense)}</td>
                          <td className={`py-3 text-right font-semibold ${net >= 0 ? "text-blue-600" : "text-red-500"}`}>
                            {net >= 0 ? "+" : ""}{formatRpFull(net)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
