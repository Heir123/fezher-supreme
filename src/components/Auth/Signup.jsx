function Signup() {
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "60px auto",
        padding: "30px",
        background: "#1e293b",
        borderRadius: "12px",
        color: "white",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Create Account</h2>

      <input
        type="text"
        placeholder="Full Name"
        style={{ width: "100%", padding: "12px", marginTop: "15px" }}
      />

      <input
        type="email"
        placeholder="Email"
        style={{ width: "100%", padding: "12px", marginTop: "15px" }}
      />

      <input
        type="password"
        placeholder="Password"
        style={{ width: "100%", padding: "12px", marginTop: "15px" }}
      />

      <button
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "14px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Create Account
      </button>
    </div>
  );
}

export default Signup;