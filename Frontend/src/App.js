import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ManageLeaves from "./components/ManageLeaves";
import AdminDashboard from "./components/AdminDashboard";
import AddEmployee from "./components/AddEmployee";
import EmployeeDashboard from "./components/EmployeeDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-employee"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-leaves"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageLeaves />
            </ProtectedRoute>
          }
        />        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
