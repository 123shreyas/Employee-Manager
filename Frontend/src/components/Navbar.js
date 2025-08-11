import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("username");
  const employeeId = localStorage.getItem("employeeId");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={{ color: "#fff" }}> Employee Management</h2>
      <div style={styles.userSection}>
        <span style={styles.username}>{userName}</span>
        <span style={styles.employeeId}>{employeeId}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    padding: "10px 20px",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  username: {
    color: "#fff", // force white text
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  employeeId: {
    color: "#fff", // force white text
    fontSize: "1 rem",
    fontWeight: "bold",
  },
  logoutBtn: {
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  marginLeft: "20px", // pushes button further away from username
},

};

export default Navbar;
