function App() {
  return (
    <>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        background: "#0F172A",
        color: "white"
      }}>
        <h2>BizFlow</h2>

        <div>
          <a href="#" style={{color:"white",marginRight:20}}>Features</a>
          <a href="#" style={{color:"white",marginRight:20}}>Pricing</a>
          <a href="#" style={{color:"white"}}>Login</a>
        </div>
      </nav>

      <section style={{
        textAlign:"center",
        padding:"100px 20px",
        background:"#F8FAFC"
      }}>
        <h1 style={{fontSize:"56px"}}>
          Manage Your Business From Anywhere
        </h1>

        <p style={{
          fontSize:"22px",
          maxWidth:"700px",
          margin:"20px auto"
        }}>
          Inventory, Sales, Customers, Invoices and Reports —
          all in one cloud platform.
        </p>

        <button style={{
          padding:"15px 35px",
          background:"#2563EB",
          color:"white",
          border:"none",
          borderRadius:"8px",
          fontSize:"18px",
          cursor:"pointer"
        }}>
          Start Free
        </button>
      </section>
    </>
  );
}

export default App;