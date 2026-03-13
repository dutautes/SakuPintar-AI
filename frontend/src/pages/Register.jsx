import { useState } from "react";
import axios from "axios";
import "./Register.css";
import { useNavigate } from "react-router-dom";

function Register() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/register",
        {
          name,
          phone,
          email,
          password
        }
      );

      console.log(response.data);

      alert("Register berhasil");

      // setelah register pindah ke login
      navigate("/");

    } catch (error) {

      console.log(error);
      alert("Register gagal");

    }

  };

  return (

    <div className="register-container">

      <h1 className="title">Sign Up</h1>

      <div className="input-group">
        <label>Full Name</label>
        <input
          name="name"
          placeholder="Your name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Phone Number</label>
        <input
          name="phone"
          placeholder="+62xxxx"
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

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

      <button
        className="login-button"
        onClick={handleRegister}
      >
        Sign Up
      </button>

      <p className="signin-text">
        Already have an account?
        <span onClick={() => navigate("/")}> Sign In</span>
      </p>

    </div>

  );
}

export default Register;