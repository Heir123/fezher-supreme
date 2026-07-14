function Features() {
  const features = [
    { title: "Inventory", desc: "Track stock in real time." },
    { title: "Sales", desc: "Manage sales and invoices easily." },
    { title: "CRM", desc: "Keep all your customers in one place." },
    { title: "Finance", desc: "Monitor income and expenses." },
    { title: "Employees", desc: "Manage staff and payroll." },
    { title: "Reports", desc: "Generate business reports instantly." },
  ];

  return (
    <section id="features" style={{ padding: "80px 40px", textAlign: "center" }}>
      <h2>Features</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              background: "#1f2937",
              color: "white",
              padding: "30px",
              borderRadius: "12px",
            }}
          >
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;