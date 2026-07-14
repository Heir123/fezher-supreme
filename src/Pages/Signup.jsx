import { useState } from "react";
import { supabase } from "../services/supabase";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Account created successfully! Check your email to verify your account.");
    }
  }

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Create Account</h1>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "12px", width: "300px", margin: "10px" }}
      />

      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "12px", width: "300px", margin: "10px" }}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "12px", width: "300px", margin: "10px" }}
      />

      <br />

      <button
        onClick={handleSignup}
        style={{
          padding: "12px 30px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Sign Up
      </button>
    </div>
  );
}

export default Signup;