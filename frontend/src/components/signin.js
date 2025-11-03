import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Signin({ setToken }) {
  const [form, setForm] = useState({ user_id: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await api.post("/signin", form);
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <input className="form-control mb-2" placeholder="User ID" onChange={e => setForm({...form, user_id: e.target.value})} />
      <input className="form-control mb-2" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
}
