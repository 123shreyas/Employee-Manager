import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ManageLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/api/leaves", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves", err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await API.put(`/api/leaves/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(`Leave ${status}`);
      fetchLeaves();
    } catch (err) {
      console.error(`Error updating leave status`, err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading leave requests...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Manage Leave Requests</h2>

        {leaves.length === 0 ? (
          <div className="alert alert-info text-center">
            No leave requests found
          </div>
        ) : (
          <div className="table-responsive shadow rounded">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Employee ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.employeeId}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.days}</td>
                    <td>{leave.reason || "—"}</td>
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
                    <td>
                      {leave.status === "pending" ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              updateLeaveStatus(leave.id, "approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              updateLeaveStatus(leave.id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-muted">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center mt-4">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
