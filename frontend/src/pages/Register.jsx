import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Set login state setelah sign up
    localStorage.setItem("loggedIn", "true");
    // Redirect ke dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#020617]">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 w-[550px] rounded-2xl p-10 shadow-lg">
        <h1 className="text-white text-2xl text-center mb-8 font-semibold">Sign Up</h1>

        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-1">Full Name</p>
          <div className="flex items-center border-b border-gray-600 pb-2">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="bg-transparent outline-none text-white w-full"
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-1">Email Address</p>
          <div className="flex items-center border-b border-gray-600 pb-2">
            <input
              type="email"
              name="email"
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
          onClick={handleSignUp}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-medium"
        >
          Sign Up
        </button>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;