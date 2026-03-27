import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault(); // ✅ penting

    if (!name || !email || !password) {
      return toast.error("Semua field wajib diisi!");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#020617]">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 w-[550px] rounded-2xl p-10 shadow-lg">
        <h1 className="text-white text-2xl text-center mb-8 font-semibold">Sign Up</h1>

        {/* ✅ FORM DITAMBAHKAN */}
        <form onSubmit={handleSignUp}>

          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-1">Full Name</p>
            <div className="flex items-center border-b border-gray-600 pb-2">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-1">Email Address</p>
            <div className="flex items-center border-b border-gray-600 pb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-400 text-sm mb-1">Password</p>
            <div className="flex items-center border-b border-gray-600 pb-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
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
            Sign Up
          </button>

        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;