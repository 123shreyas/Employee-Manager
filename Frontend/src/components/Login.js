import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.user.name);
      localStorage.setItem("employeeId", res.data.user.employeeId);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #568aceff, #4c435bff)",
      }}
    >
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4 text-primary">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3 input-group">
            <span className="input-group-text bg-primary text-white">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text bg-primary text-white">
              <FaLock />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            style={{
              transition: "background 0.3s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.background = "#0056b3")}
            onMouseOut={(e) => (e.target.style.background = "")}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
