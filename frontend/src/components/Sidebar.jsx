import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillWallet } from "react-icons/ai";
import { FiHome, FiCreditCard, FiPieChart, FiUser, FiSettings, FiX } from "react-icons/fi";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "User";
  const userAvatar = localStorage.getItem("userAvatar") || null;

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Transactions", icon: <FiCreditCard />, path: "/transactions" },
    { name: "Analytics", icon: <FiPieChart />, path: "/analytics" },
    { name: "Profile", icon: <FiUser />, path: "/profile" },
    { name: "Settings", icon: <FiSettings />, path: "/settings" },
  ];

  return (
    <>
      {/* Overlay Backdrop (Mobile only) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[40] md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-[50] w-64 bg-gradient-to-b from-[#0b1220] via-[#14213d] to-[#1f3a8a] text-white p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex md:flex-col md:justify-between
      `}>
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Logo & Close Button (Mobile only) */}
            <div className="flex items-center justify-between gap-3 mb-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <AiFillWallet size={16} />
                </div>
                <h1 className="text-lg font-semibold">SakuPintar AI</h1>
              </div>
              <button onClick={onClose} className="md:hidden text-gray-300 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            {/* Menu */}
            <ul className="space-y-3 text-sm">
              {menuItems.map(item => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={onClose}
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

          {/* User Section */}
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl mt-10">
            <div className="flex items-center gap-3">
              {userAvatar ? (
                <img src={userAvatar} className="w-9 h-9 rounded-full object-cover" alt="avatar" />
              ) : (
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=1e3a8a`}
                  className="w-9 h-9 rounded-full"
                  alt="avatar"
                />
              )}
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-300">Member</p>
              </div>
            </div>
            <span className="text-gray-300">›</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;