import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FiSearch, FiBell, FiCamera, FiMapPin, FiCalendar, FiMenu } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate    = useNavigate();
  const fileRef     = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activeToggle, setActiveToggle]   = useState({ alerts: true, summary: true, updates: false });
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", bio: "", location: "" });
  const [passwords, setPasswords]   = useState({ current: "", new: "", confirm: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Load saved avatar from localStorage
    const saved = localStorage.getItem("userAvatar");
    if (saved) setAvatarPreview(saved);

    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setProfile(data);
        const nameParts = (data.name || "").split(" ");
        setForm({
          firstName: nameParts[0] || "",
          lastName:  nameParts.slice(1).join(" ") || "",
          phone:     data.phone    || "",
          bio:       data.bio      || "",
          location:  data.location || "",
        });
        setActiveToggle({
          alerts:  data.alerts  ?? true,
          summary: data.summary ?? true,
          updates: data.updates ?? false,
        });
        setLoading(false);
      })
      .catch(() => { toast.error("Gagal memuat profil"); setLoading(false); });
  }, []);

  // Ganti foto — simpan ke localStorage sebagai base64
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 3 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setAvatarPreview(base64);
      localStorage.setItem("userAvatar", base64);
      toast.success("Foto profil berhasil diubah!");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const updateData = {
      name:     `${form.firstName} ${form.lastName}`.trim(),
      phone:    form.phone,
      bio:      form.bio,
      location: form.location,
      alerts:   activeToggle.alerts,
      summary:  activeToggle.summary,
      updates:  activeToggle.updates,
    };
    fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body:    JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.data || data);
        // Sync name to localStorage
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        stored.name  = updateData.name;
        localStorage.setItem("user", JSON.stringify(stored));
        toast.success("Profile berhasil diupdate!");
      })
      .catch(() => toast.error("Gagal update profil"));
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) return toast.error("Semua field password wajib diisi!");
    if (passwords.new !== passwords.confirm)  return toast.error("Password baru dan konfirmasi tidak cocok!");
    if (passwords.new.length < 6)             return toast.error("Password baru minimal 6 karakter!");
    fetch("http://localhost:5000/api/settings/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Password berhasil diubah") {
          toast.success("Password berhasil diubah!");
          setPasswords({ current: "", new: "", confirm: "" });
        } else {
          toast.error(data.message || "Gagal mengubah password");
        }
      })
      .catch(() => toast.error("Gagal mengubah password"));
  };

  const handleSavePreferences = () => {
    fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ alerts: activeToggle.alerts, summary: activeToggle.summary, updates: activeToggle.updates }),
    })
      .then(() => toast.success("Preferensi email disimpan!"))
      .catch(() => toast.error("Gagal menyimpan preferensi"));
  };
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
      </div>
    );
  }

  const displayName   = profile?.name || `${form.firstName} ${form.lastName}`.trim() || "User";
  const avatarSrc     = avatarPreview || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}&backgroundColor=1e3a8a`;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 bg-white rounded-lg shadow-sm text-gray-600"
              >
                <FiMenu size={20} />
              </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">My Profile</h1>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center bg-transparent border-b border-gray-200 px-2 py-1 w-64">
              <FiSearch className="text-gray-400 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm w-full text-gray-500" />
            </div>
            <div className="relative cursor-pointer bg-white p-2 rounded-full border border-gray-100 shadow-sm">
              <FiBell className="text-gray-500 text-lg" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              {/* Avatar + upload */}
              <div className="relative mb-4">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-[#1e1b4b] p-2 rounded-full text-white border-2 border-white hover:bg-blue-700 transition"
                  title="Ganti foto"
                >
                  <FiCamera size={16} />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
              <p className="text-xs text-gray-400 mb-2">{profile?.email || "-"}</p>
              <p className="text-[10px] text-gray-400 mb-4 italic">Klik ikon kamera untuk ganti foto</p>

              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold mb-8">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                {profile?.status || "Active"}
              </div>

              <div className="w-full text-left space-y-3 text-gray-500 text-xs font-medium border-t pt-6">
                {form.location && (
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-gray-400" />
                    <span>{form.location}</span>
                  </div>
                )}
                {profile?.joined && (
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-gray-400" />
                    <span>Joined {profile.joined}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-8 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700">First Name</label>
                  <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700">Last Name</label>
                  <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700">Email Address</label>
                  <input type="email" value={profile?.email || ""} disabled
                    className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xl text-sm text-gray-400 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700">Phone Number</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[11px] font-bold text-gray-700">Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Jakarta, Indonesia"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <label className="text-[11px] font-bold text-gray-700">Bio</label>
                <textarea rows="3" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
              </div>
              <div className="flex justify-end">
                <button onClick={handleSaveProfile}
                  className="w-full sm:w-auto bg-[#111827] text-white px-8 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-6">Security & Password</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700">Current Password</label>
                  <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="••••••••"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700">New Password</label>
                    <input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      placeholder="Min. 6 karakter"
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700">Confirm New Password</label>
                    <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Ulangi password baru"
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleUpdatePassword}
                    className="w-full sm:w-auto border border-gray-200 text-gray-900 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition">
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Email Preferences */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-6">Email Preferences</h3>
              <div className="space-y-6">
                {[
                  { id: "alerts",  title: "Transaction Alerts",  desc: "Notifikasi saat transaksi baru dicatat." },
                  { id: "summary", title: "Weekly Summary",       desc: "Ringkasan pengeluaran mingguan via email." },
                  { id: "updates", title: "Product Updates",      desc: "Info update & fitur baru SakuPintar AI." },
                ].map((pref) => (
                  <div key={pref.id} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{pref.title}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{pref.desc}</p>
                    </div>
                    <button
                      onClick={() => setActiveToggle({ ...activeToggle, [pref.id]: !activeToggle[pref.id] })}
                      className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${activeToggle[pref.id] ? "bg-[#111827]" : "bg-gray-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${activeToggle[pref.id] ? "right-1" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={handleSavePreferences}
                  className="w-full sm:w-auto bg-[#111827] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition">
                  Simpan Preferensi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
