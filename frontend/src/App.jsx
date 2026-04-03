import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AddTransaction from "./pages/AddTransaction"; 

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Protected route component
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/add-transaction"   
          element={
            <PrivateRoute>
              <AddTransaction />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;