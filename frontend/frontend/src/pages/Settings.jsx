import React from "react";
import Sidebar from "../components/Sidebar";

function Settings() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-[#f5f7fb]">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>
        <p>Di sini bisa mengatur preferensi dan konfigurasi pengguna.</p>
      </div>
    </div>
  );
}

export default Settings;