import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillWallet } from "react-icons/ai";
import { FiHome, FiCreditCard, FiPieChart, FiUser, FiSettings } from "react-icons/fi";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Transactions", icon: <FiCreditCard />, path: "/transactions" },
    { name: "Analytics", icon: <FiPieChart />, path: "/analytics" },
    { name: "Profile", icon: <FiUser />, path: "/profile" },
    { name: "Settings", icon: <FiSettings />, path: "/settings" },
  ];

  return (
    <div className="w-64 flex flex-col justify-between bg-gradient-to-b from-[#0b1220] via-[#14213d] to-[#1f3a8a] text-white p-6 overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-white/10 p-2 rounded-lg">
            <AiFillWallet size={16} />
          </div>
          <h1 className="text-lg font-semibold">SakuPintar AI</h1>
        </div>

        {/* Menu */}
        <ul className="space-y-3 text-sm">
          {menuItems.map(item => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition 
                  ${location.pathname === item.path ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"}`}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* User */}
      <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/40" className="rounded-full" alt="User" />
          <div>
            <p className="text-sm font-medium">Alex K.</p>
            <p className="text-xs text-gray-300">Pro Member</p>
          </div>
        </div>
        <span className="text-gray-300">›</span>
      </div>
    </div>
  );
}

export default Sidebar;