function Hero() {
  return (
    <section
      style={{
        textAlign: "center",
        padding: "100px 20px",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "56px", marginBottom: "20px" }}>
        Manage Your Business Smarter
      </h1>

      <p
        style={{
          fontSize: "22px",
          maxWidth: "700px",
          margin: "0 auto 40px",
        }}
      >
        Inventory, Sales, CRM, Finance, Employees and Reports —
        everything your business needs in one cloud platform.
      </p>

      <div style={{ marginBottom: "60px" }}>
        <button
          style={{
            padding: "15px 35px",
            marginRight: "15px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Start Free Trial
        </button>

        <button
          style={{
            padding: "15px 35px",
            background: "transparent",
            color: "white",
            border: "2px solid white",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Book a Demo
        </button>
      </div>

      <img
        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
        alt="Business Dashboard"
        style={{
          width: "80%",
          maxWidth: "900px",
          borderRadius: "15px",
        }}
      />
    </section>
  );
}

export default Hero;