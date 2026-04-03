import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return toast.error("Semua field wajib diisi!");
    }

    if (password !== confirmPassword) {
      return toast.error("Password tidak cocok!");
    }

    if (password.length < 6) {
      return toast.error("Password minimal 6 karakter");
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Register berhasil!");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(data.message || "Register gagal");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* --- SISI KIRI: SECURE BANKING VISUAL --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#122452] relative items-center justify-center p-12">
        {/* Background Decorative Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2d5f] to-[#0b1a44]"></div>
        
        {/* Glassmorphism Card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 p-10 rounded-[32px] shadow-2xl max-w-sm text-center">
          <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            {/* Shield Icon */}
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-white text-3xl font-bold mb-4">Secure Banking</h2>
          <p className="text-blue-100/70 leading-relaxed">
            Join thousands of users managing their finances smarter with SakuPintar AI today.
          </p>
        </div>
      </div>

      {/* --- SISI KANAN: FORM REGISTER --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-[#0b1a44] p-2.5 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="text-[#0b1a44] font-bold text-2xl tracking-tight">SakuPintar AI</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">Create account</h1>
          <p className="text-gray-500 mb-10 font-medium">Start managing your finances in minutes.</p>

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Alex K."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Password Grid (Side by Side) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm</label>
                <input
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0b1a44] text-white font-bold py-4 rounded-xl hover:bg-[#162a5e] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-blue-900/10 mt-4"
            >
              Create account
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-gray-500 mt-10 font-medium">
            Already have an account?{" "}
            <Link to="/" className="text-[#0b1a44] font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;