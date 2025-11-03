import React, { useState } from "react";
import api from "../api";

export default function Signup() {
  const [form, setForm] = useState({ user_id: "", password: "", name: "" });

  const handleSubmit = async e => {
    e.preventDefault();
    await api.post("/signup", form);
    alert("Signup successful!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input className="form-control mb-2" placeholder="User ID" onChange={e => setForm({...form, user_id: e.target.value})} />
      <input className="form-control mb-2" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input className="form-control mb-2" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button className="btn btn-success">Sign Up</button>
    </form>
  );
}
