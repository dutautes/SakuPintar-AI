import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault(); // ✅ penting

    if (!email || !password) {
      return toast.error("Email dan password wajib diisi!");
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login berhasil!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Email atau password salah!");
      }

    } catch (err) {
      toast.error("Server error, coba lagi nanti.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#020617]">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 w-[550px] rounded-2xl p-10 shadow-lg">
        <h1 className="text-white text-2xl text-center mb-8 font-semibold">Sign In</h1>

        {/* ✅ FORM DITAMBAHKAN */}
        <form onSubmit={handleSignIn}>
          
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-1">Email Address</p>
            <div className="flex items-center border-b border-gray-600 pb-2">
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-400 text-sm mb-1">Password</p>
            <div className="flex items-center border-b border-gray-600 pb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 ml-2"
              >
                👁
              </button>
            </div>
          </div>

          <button
            type="submit" // ✅ diubah
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-medium"
          >
            Sign In
          </button>

        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          I'm a new user?{" "}
          <Link to="/register" className="text-blue-400">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;