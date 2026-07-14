function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: "80px 40px",
        background: "#0f172a",
        color: "white",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "42px" }}>Contact Us</h2>

      <p style={{ marginBottom: "40px", color: "#cbd5e1" }}>
        We'd love to hear from you. Send us a message.
      </p>

      <form
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Your Name"
          style={{
            padding: "15px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <input
          type="email"
          placeholder="Your Email"
          style={{
            padding: "15px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <textarea
          rows="5"
          placeholder="Your Message"
          style={{
            padding: "15px",
            borderRadius: "8px",
            border: "none",
          }}
        ></textarea>

        <button
          type="submit"
          style={{
            padding: "15px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>

      <div style={{ marginTop: "50px" }}>
        <p>📧 support@fezhersupreme.co.za</p>
        <p>📞 +27 78 482 2311</p>
        <p>📍 Johannesburg, South Africa</p>
      </div>
    </section>
  );
}

export default Contact;