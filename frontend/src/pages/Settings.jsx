import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FiMoon, FiSun, FiGlobe, FiBell, FiShield, FiTrash2, FiLogOut, FiLock,
} from "react-icons/fi";

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${value ? "bg-blue-600" : "bg-gray-200"}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${value ? "right-1" : "left-1"}`} />
    </button>
  );
}

function Settings() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  // ── Dark mode ──────────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // ── Lainnya ────────────────────────────────────────────────────────────────
  const [passwords, setPasswords]   = useState({ current: "", new: "", confirm: "" });
  const [loadingPw, setLoadingPw]   = useState(false);
  const [deletePassword, setDeletePassword]       = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete]         = useState(false);

  // Tambahan setting
  const [currency, setCurrency]     = useState(localStorage.getItem("currency") || "IDR");
  const [language, setLanguage]     = useState(localStorage.getItem("language") || "id");
  const [notifTrx, setNotifTrx]     = useState(localStorage.getItem("notifTrx") !== "false");
  const [notifWeek, setNotifWeek]   = useState(localStorage.getItem("notifWeek") !== "false");
  const [twoFA, setTwoFA]           = useState(localStorage.getItem("twoFA") === "true");
  const [autoLogout, setAutoLogout] = useState(localStorage.getItem("autoLogout") === "true");

  const saveMisc = () => {
    localStorage.setItem("currency",   currency);
    localStorage.setItem("language",   language);
    localStorage.setItem("notifTrx",   String(notifTrx));
    localStorage.setItem("notifWeek",  String(notifWeek));
    localStorage.setItem("twoFA",      String(twoFA));
    localStorage.setItem("autoLogout", String(autoLogout));
    toast.success("Pengaturan disimpan!");
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) return toast.error("Semua field wajib diisi!");
    if (passwords.new !== passwords.confirm) return toast.error("Password baru dan konfirmasi tidak cocok!");
    if (passwords.new.length < 6)            return toast.error("Password baru minimal 6 karakter!");
    setLoadingPw(true);
    try {
      const res  = await fetch("http://localhost:5000/api/settings/password", {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password berhasil diubah!");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        toast.error(data.message || "Gagal mengubah password");
      }
    } catch { toast.error("Server error, coba lagi."); }
    finally  { setLoadingPw(false); }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return toast.error("Masukkan password untuk konfirmasi!");
    setLoadingDelete(true);
    try {
      const res  = await fetch("http://localhost:5000/api/settings/account", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Akun berhasil dihapus.");
        localStorage.clear();
        navigate("/");
      } else {
        toast.error(data.message || "Gagal menghapus akun");
      }
    } catch { toast.error("Server error, coba lagi."); }
    finally  { setLoadingDelete(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const card = "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-5";
  const label = "text-xs font-bold text-gray-700 block mb-1";
  const input = "w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-[#f5f7fb]"}`}>
      <Sidebar />
      <div className={`flex-1 p-8 max-w-2xl overflow-y-auto`}>
        <h1 className={`text-2xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Settings</h1>
        <p className={`text-sm mb-8 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>Kelola tampilan, keamanan, dan preferensi akun kamu</p>

        {/* ── Tampilan ── */}
        <div className={card}>
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            {darkMode ? <FiMoon className="text-blue-400" /> : <FiSun className="text-yellow-500" />}
            Tampilan
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Mode Gelap</p>
              <p className="text-xs text-gray-400 mt-0.5">Aktifkan tampilan dark mode untuk seluruh aplikasi</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                {darkMode ? "🌙 Dark" : "☀️ Light"}
              </span>
              <Toggle value={darkMode} onChange={setDarkMode} />
            </div>
          </div>
        </div>

        {/* ── Bahasa & Mata Uang ── */}
        <div className={card}>
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <FiGlobe className="text-green-500" />
            Bahasa & Mata Uang
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Bahasa</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}
                className={input}>
                <option value="id">🇮🇩 Bahasa Indonesia</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>
            <div>
              <label className={label}>Mata Uang</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                className={input}>
                <option value="IDR">🇮🇩 IDR — Rupiah</option>
                <option value="USD">🇺🇸 USD — Dollar</option>
                <option value="SGD">🇸🇬 SGD — Dollar Singapura</option>
                <option value="MYR">🇲🇾 MYR — Ringgit</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Notifikasi ── */}
        <div className={card}>
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <FiBell className="text-orange-500" />
            Notifikasi
          </h2>
          <div className="space-y-4">
            {[
              { label: "Notifikasi Transaksi",      desc: "Terima notif saat transaksi baru dicatat",   val: notifTrx,  set: setNotifTrx  },
              { label: "Laporan Mingguan",           desc: "Kirim rangkuman pengeluaran tiap minggu",    val: notifWeek, set: setNotifWeek },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{n.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                </div>
                <Toggle value={n.val} onChange={n.set} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Keamanan Tambahan ── */}
        <div className={card}>
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <FiShield className="text-purple-500" />
            Keamanan Lanjutan
          </h2>
          <div className="space-y-4">
            {[
              { label: "Two-Factor Auth (2FA)",     desc: "Aktifkan verifikasi dua langkah saat login", val: twoFA,      set: setTwoFA      },
              { label: "Auto Logout (30 menit)",    desc: "Logout otomatis jika tidak aktif 30 menit",  val: autoLogout, set: setAutoLogout },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{n.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                </div>
                <Toggle value={n.val} onChange={n.set} />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={saveMisc}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition">
              Simpan Pengaturan
            </button>
          </div>
        </div>

        {/* ── Ganti Password ── */}
        <div className={card}>
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <FiLock className="text-blue-500" />
            Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className={label}>Current Password</label>
              <input type="password" placeholder="••••••••" value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className={input} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>New Password</label>
                <input type="password" placeholder="Min. 6 karakter" value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className={input} />
              </div>
              <div>
                <label className={label}>Confirm Password</label>
                <input type="password" placeholder="Ulangi password" value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className={input} />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={handleChangePassword} disabled={loadingPw}
                className="bg-[#111827] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition disabled:opacity-60">
                {loadingPw ? "Saving..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Session ── */}
        <div className={card}>
          <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FiLogOut className="text-gray-500" />
            Session
          </h2>
          <p className="text-xs text-gray-400 mb-4">Keluar dari akun ini di perangkat ini.</p>
          <button onClick={handleLogout}
            className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition">
            Logout
          </button>
        </div>

        {/* ── Danger Zone ── */}
        <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
          <h2 className="text-base font-bold text-red-600 mb-2 flex items-center gap-2">
            <FiTrash2 />
            Danger Zone
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Menghapus akun akan menghapus semua data transaksi dan profil secara permanen. Tindakan ini tidak bisa dibatalkan.
          </p>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition">
              Delete My Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-700">Konfirmasi dengan password kamu:</p>
              <input type="password" placeholder="••••••••" value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-red-200 rounded-xl text-sm focus:outline-red-400" />
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); }}
                  className="flex-1 border border-gray-200 rounded-xl py-2 text-xs font-bold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} disabled={loadingDelete}
                  className="flex-1 bg-red-600 text-white rounded-xl py-2 text-xs font-bold hover:bg-red-700 transition disabled:opacity-60">
                  {loadingDelete ? "Deleting..." : "Yes, Delete Account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
