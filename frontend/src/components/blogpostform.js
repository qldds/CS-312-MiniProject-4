import React, { useState } from "react";
import api from "../api";

export default function BlogPostForm({ token }) {
  const [form, setForm] = useState({ title: "", body: "" });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!token) return alert("Please sign in first");
    await api.post("/posts", form, { headers: { Authorization: `Bearer ${token}` } });
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Post</h2>
      <input className="form-control mb-2" placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} />
      <textarea className="form-control mb-2" placeholder="Body" onChange={e => setForm({...form, body: e.target.value})}></textarea>
      <button className="btn btn-success">Post</button>
    </form>
  );
}
