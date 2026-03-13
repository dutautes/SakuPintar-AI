import { useState } from "react";
import axios from "axios";
import "./login.css";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {

      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          email,
          password
        }
      );

      console.log(response.data);

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");

    } catch (error) {
      console.log(error);
      alert("Login gagal");
    }
  };

  return (
    <div className="login-container">

      <h1 className="title">Sign In</h1>

      <div className="input-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="example@email.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="login-button" onClick={handleLogin}>
        Sign In
      </button>

      <p className="signup-text">
        I'm a new user?
        <span onClick={() => navigate("/register")}> Sign Up</span>
      </p>

    </div>
  );
}

export default Login;