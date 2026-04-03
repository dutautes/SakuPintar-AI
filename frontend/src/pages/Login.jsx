import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    const lastLogout = parseInt(localStorage.getItem("lockoutTime"));
    const now = Date.now();

    if (lastLogout && now - lastLogout < 10 * 1000) {
      return toast.error("Tunggu 10 detik sebelum login lagi!");
    }

    if (!email || !password) {
      return toast.error("Email dan password wajib diisi!");
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login berhasil!");
        window.location.href = "/dashboard";
      } else {
        toast.error(data.message || "Email atau password salah!");
      }
    } catch (err) {
      toast.error("Server error, coba lagi nanti.");
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* --- SISI KIRI: VISUAL (Sesuai Gambar) --- */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0d2159] relative items-center justify-center p-12 overflow-hidden">
        {/* Dekorasi Cahaya di Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        
        {/* Grouping Kartu Portfolio */}
        <div className="relative z-10 w-full max-w-md">
          {/* Kartu Atas: Total Portfolio */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl mb-8 transform -translate-x-12 translate-y-6">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white text-2xl">🕒</span>
            </div>
            <p className="text-blue-100/70 text-sm mb-1">Total Portfolio</p>
            <h2 className="text-white text-4xl font-bold tracking-tight">$142,500.00</h2>
          </div>

          {/* Kartu Bawah: Monthly Growth */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl ml-12">
            <div className="flex justify-between items-center mb-6">
              <p className="text-white font-semibold text-lg">Monthly Growth</p>
              <span className="bg-[#22c55e2b] text-[#4ade80] text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
                +12.5%
              </span>
            </div>
            {/* Bar Chart Sederhana */}
            <div className="flex items-end gap-3 h-24">
              <div className="bg-white/20 w-full h-[35%] rounded-md"></div>
              <div className="bg-white/30 w-full h-[55%] rounded-md"></div>
              <div className="bg-white/20 w-full h-[45%] rounded-md"></div>
              <div className="bg-white/50 w-full h-[75%] rounded-md"></div>
              <div className="bg-white w-full h-[100%] rounded-md shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SISI KANAN: FORM LOGIN --- */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-20 bg-white">
        <div className="w-full max-w-sm">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-[#0b1a44] p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="text-[#0b1a44] font-bold text-2xl tracking-tight">SakuPintar AI</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome back</h1>
          <p className="text-gray-500 mb-10 font-medium">Enter your details to access your dashboard.</p>

          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 placeholder:text-gray-300"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Remember me</span>
              </label>
              <Link to="/forgot" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0b1a44] text-white font-bold py-4 rounded-xl hover:bg-[#162a5e] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-blue-900/10 mt-2"
            >
              Sign in
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 mt-10 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;