// src/components/EmployeeDashboard.js
import React, { useState, useEffect } from "react";
import API from "../api";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function EmployeeDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/leaves/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLeaves(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        "/api/leaves",
        {
          start_date: startDate,
          end_date: endDate,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Leave request submitted!");
      setStartDate("");
      setEndDate("");
      setReason("");
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Error applying for leave");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ maxWidth: "800px" }}>
        <h2 className="text-center mb-4">Employee Dashboard</h2>

        {/* Apply for Leave Form */}
        <div className="card p-4 mb-5 shadow-sm">
          <h4 className="mb-3">Apply for Leave</h4>
          <form onSubmit={handleApplyLeave}>
            <div className="mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Reason (Optional)</label>
              <textarea
                className="form-control"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason (optional)"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit Leave
            </button>
          </form>
        </div>

        {/* My Leave Requests Table */}
        <h4 className="mb-3">My Leave Requests</h4>
        {loading ? (
          <p>Loading...</p>
        ) : leaves.length === 0 ? (
          <div className="alert alert-info">No leave requests found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.days}</td>
                    <td>
                      <span
                        className={`badge ${
                          leave.status === "approved"
                            ? "bg-success"
                            : leave.status === "rejected"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td>{leave.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
