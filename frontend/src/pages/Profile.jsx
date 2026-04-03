import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FiSearch, FiBell, FiCamera, FiMapPin, FiCalendar } from "react-icons/fi";
import { ChevronRight } from "lucide-react";

function Profile() {
  const [activeToggle, setActiveToggle] = useState({
    alerts: true,
    summary: true,
    updates: false,
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-transparent border-b border-gray-200 px-2 py-1 w-64">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search settings..."
                className="bg-transparent outline-none text-sm w-full text-gray-500"
              />
            </div>
            <div className="relative cursor-pointer bg-white p-2 rounded-full border border-gray-100 shadow-sm">
              <FiBell className="text-gray-500 text-lg" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* LEFT COLUMN: PROFILE CARD */}
          <div className="col-span-4">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src="https://i.pravatar.cc/150?u=alex"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
                <button className="absolute bottom-1 right-1 bg-[#1e1b4b] p-2 rounded-full text-white border-2 border-white">
                  <FiCamera size={16} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900">Alex K.</h2>
              <p className="text-xs text-gray-400 mb-4">alex.k@example.com</p>
              
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold mb-8">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                Pro Member
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xl font-bold text-gray-900">342</p>
                  <p className="text-[10px] text-gray-400 font-medium">Transactions</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xl font-bold text-gray-900">1.2k</p>
                  <p className="text-[10px] text-gray-400 font-medium">Points</p>
                </div>
              </div>

              <div className="w-full text-left space-y-3 text-gray-500 text-xs font-medium border-t pt-6">
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-gray-400" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-gray-400" />
                  <span>Joined October 2022</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SETTINGS FORM */}
          <div className="col-span-8 space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700">First Name</label>
                  <input type="text" defaultValue="Alex" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700">Last Name</label>
                  <input type="text" defaultValue="K." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700">Email Address</label>
                  <input type="email" defaultValue="alex.k@example.com" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700">Phone Number</label>
                  <input type="text" defaultValue="+1 (555) 123-4567" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-blue-500" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <label className="text-[11px] font-bold text-gray-700">Bio</label>
                <textarea rows="3" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-blue-500 resize-none">Tech enthusiast and avid saver trying to optimize monthly budgeting and achieve financial independence.</textarea>
              </div>
              <div className="flex justify-end">
                <button className="bg-[#111827] text-white px-8 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all">Save Changes</button>
              </div>
            </div>

            {/* Security & Password */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-6">Security & Password</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700">Current Password</label>
                  <input type="password" placeholder="********" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <p className="text-[10px] text-gray-400">Last changed: 3 months ago</p>
                  <button className="border border-gray-200 text-gray-900 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50">Update Password</button>
                </div>
              </div>
            </div>

            {/* Email Preferences */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-6">Email Preferences</h3>
              <div className="space-y-6">
                {[
                  { id: 'alerts', title: 'Transaction Alerts', desc: 'Get notified when a new transaction is recorded.' },
                  { id: 'summary', title: 'Weekly Summary', desc: 'Receive a weekly breakdown of your spending.' },
                  { id: 'updates', title: 'Product Updates', desc: 'Receive news about SakuPintar AI updates and features.' }
                ].map((pref) => (
                  <div key={pref.id} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{pref.title}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{pref.desc}</p>
                    </div>
                    <button 
                      onClick={() => setActiveToggle({...activeToggle, [pref.id]: !activeToggle[pref.id]})}
                      className={`w-11 h-6 rounded-full transition-all duration-300 relative ${activeToggle[pref.id] ? 'bg-[#111827]' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${activeToggle[pref.id] ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;