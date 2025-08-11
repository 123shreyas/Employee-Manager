// src/components/AddEmployee.js
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AddEmployee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const navigate = useNavigate();

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(
        "/api/employees",
        {
          name,
          email,
          password,
          department,
          joining_date: joiningDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(
        `Employee added!\nID: ${res.data.employeeId}\nEmail: ${res.data.email}\nPassword: ${res.data.password}`
      );
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding employee");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Add Employee</h2>
        <form
          className="mx-auto p-4 border rounded shadow-sm"
          style={{ maxWidth: "500px" }}
          onSubmit={handleAddEmployee}
        >
          <div className="mb-3">
            <label className="form-label">Employee Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Employee Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Temporary Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter temporary password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter department name"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Joining Date</label>
            <input
              type="date"
              className="form-control"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Add Employee
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin")}
            >
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
