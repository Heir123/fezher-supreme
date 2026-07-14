function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      features: [
        "1 Business",
        "Basic Dashboard",
        "Inventory",
        "Email Support"
      ]
    },
    {
      name: "Professional",
      price: "R299/month",
      features: [
        "Unlimited Products",
        "Sales & POS",
        "CRM",
        "Reports",
        "Priority Support"
      ]
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      features: [
        "Everything in Professional",
        "Multiple Branches",
        "Employee Management",
        "Custom Integrations",
        "Dedicated Support"
      ]
    }
  ];

  return (
    <section
      id="pricing"
      style={{
        padding: "80px 40px",
        background: "#0f172a",
        color: "white",
        textAlign: "center"
      }}
    >
      <h2 style={{ fontSize: "42px" }}>
        Pricing Plans
      </h2>

      <p style={{ marginBottom: "50px" }}>
        Choose the plan that fits your business.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
          gap: "25px"
        }}
      >
        {plans.map((plan, index) => (
          <div
            key={index}
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "15px"
            }}
          >
            <h3>{plan.name}</h3>

            <h1
              style={{
                color: "#3b82f6",
                margin: "20px 0"
              }}
            >
              {plan.price}
            </h1>

            {plan.features.map((feature, i) => (
              <p key={i}>✓ {feature}</p>
            ))}

            <button
              style={{
                marginTop: "25px",
                padding: "12px 25px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;