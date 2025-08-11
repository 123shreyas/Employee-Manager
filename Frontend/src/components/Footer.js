import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© 2025 This Project is for Learning Purpose.</p>
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: "40px",
    padding: "15px 0",
    backgroundColor: "#222",
    color: "#fff",
    textAlign: "center",
  },
};

export default Footer;
