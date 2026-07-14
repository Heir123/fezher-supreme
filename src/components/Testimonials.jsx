function Testimonials() {
  const testimonials = [
    {
      name: "Sarah M.",
      business: "Retail Store Owner",
      comment:
        "Fezher Supreme has made managing our inventory and sales so much easier. Highly recommended!",
    },
    {
      name: "David K.",
      business: "Restaurant Manager",
      comment:
        "The POS system is fast and reliable. It has improved our daily operations.",
    },
    {
      name: "Grace N.",
      business: "Wholesale Distributor",
      comment:
        "I can monitor stock, invoices, and customers from anywhere. It's exactly what my business needed.",
    },
  ];

  return (
    <section
      style={{
        padding: "80px 40px",
        background: "#111827",
        color: "white",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "42px" }}>What Our Customers Say</h2>

      <p style={{ marginBottom: "50px", color: "#cbd5e1" }}>
        Trusted by businesses of all sizes.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px",
        }}
      >
        {testimonials.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "15px",
            }}
          >
            <h3>{item.name}</h3>
            <p style={{ color: "#60a5fa" }}>{item.business}</p>

            <p style={{ marginTop: "20px" }}>
              "{item.comment}"
            </p>

            <p style={{ marginTop: "20px", color: "#facc15" }}>
              ⭐⭐⭐⭐⭐
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;