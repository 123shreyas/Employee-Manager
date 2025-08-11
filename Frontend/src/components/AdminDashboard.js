// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    joining_date: "",
    leave_balance: "",
  });

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/api/employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const employeesWithId = res.data.map((emp) => ({
        ...emp,
        id: emp.id || emp._id || emp.firestoreDocId,
      }));

      setEmployees(employeesWithId);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await API.delete(`/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee", err);
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp.id);
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      joining_date: emp.joining_date,
      leave_balance: emp.leave_balance,
    });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        leave_balance: Number(formData.leave_balance),
        email: formData.email.toLowerCase(),
      };

      await API.put(`/api/employees/${editingEmployee}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error("Error updating employee:", err.response || err.message || err);
      alert("Failed to update employee. Check console for details.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Admin Dashboard</h2>
          <div>
            <Link to="/add-employee" className="btn btn-primary me-2">
              <i className="bi bi-person-plus"></i> Add Employee
            </Link>
            <Link to="/manage-leaves" className="btn btn-warning">
              <i className="bi bi-calendar-check"></i> Manage Leaves
            </Link>
          </div>
        </div>

        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Joining Date</th>
                <th>Leave Balance</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.employeeId}</td>
                  <td>
                    {editingEmployee === emp.id ? (
                      <input
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    ) : (
                      emp.name
                    )}
                  </td>
                  <td>
                    {editingEmployee === emp.id ? (
                      <input
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      emp.email
                    )}
                  </td>
                  <td>
                    {editingEmployee === emp.id ? (
                      <input
                        className="form-control"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    ) : (
                      emp.department
                    )}
                  </td>
                  <td>
                    {editingEmployee === emp.id ? (
                      <input
                        type="date"
                        className="form-control"
                        value={formData.joining_date}
                        onChange={(e) =>
                          setFormData({ ...formData, joining_date: e.target.value })
                        }
                      />
                    ) : (
                      emp.joining_date
                    )}
                  </td>
                  <td>
                    {editingEmployee === emp.id ? (
                      <input
                        type="number"
                        className="form-control"
                        value={formData.leave_balance}
                        onChange={(e) =>
                          setFormData({ ...formData, leave_balance: e.target.value })
                        }
                      />
                    ) : (
                      emp.leave_balance
                    )}
                  </td>
                  <td className="text-center">
                    {editingEmployee === emp.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={handleUpdate}
                        >
                          <i className="bi bi-check-circle"></i> Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingEmployee(null)}
                        >
                          <i className="bi bi-x-circle"></i> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEdit(emp)}
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(emp.id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
