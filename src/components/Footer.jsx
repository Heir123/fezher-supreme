function Footer() {
  return (
    <footer
      style={{
        background: "#020617",
        color: "white",
        padding: "50px 40px",
        marginTop: "0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        <div>
          <h2 style={{ color: "#3b82f6" }}>Fezher Supreme</h2>
          <p>
            Empowering businesses with smart,
            secure and cloud-based management solutions.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <p><a href="#home" style={{ color: "white" }}>Home</a></p>
          <p><a href="#features" style={{ color: "white" }}>Features</a></p>
          <p><a href="#pricing" style={{ color: "white" }}>Pricing</a></p>
          <p><a href="#contact" style={{ color: "white" }}>Contact</a></p>
        </div>

        <div>
          <h3>Support</h3>
          <p>Email: support@fezhersupreme.co.za</p>
          <p>Phone: +27 78 482 2311</p>
          <p>Johannesburg, South Africa</p>
        </div>

        <div>
          <h3>Follow Us</h3>
          <p>Facebook</p>
          <p>LinkedIn</p>
          <p>Instagram</p>
          <p>X (Twitter)</p>
        </div>
      </div>

      <hr style={{ margin: "30px 0", borderColor: "#334155" }} />

      <p style={{ textAlign: "center" }}>
        © 2026 Fezher Supreme. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;