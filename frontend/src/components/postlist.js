import React, { useEffect, useState } from "react";
import api from "../api";

export default function PostList({ token }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts").then(res => setPosts(res.data));
  }, []);

  const deletePost = async id => {
    await api.delete(`/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="mt-4">
      <h2>All Posts</h2>
      {posts.map(p => (
        <div key={p.id} className="card mb-3 p-3">
          <h4>{p.title}</h4>
          <p>{p.body}</p>
          <small>Author: {p.author}</small>
          {token && (
            <button onClick={() => deletePost(p.id)} className="btn btn-danger btn-sm mt-2">Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}
