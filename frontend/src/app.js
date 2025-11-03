import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import BlogPostForm from "./components/BlogPostForm";
import PostList from "./components/PostList";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <div className="container mt-4">
        <nav className="mb-4">
          <Link to="/" className="btn btn-primary me-2">Home</Link>
          {!token ? (
            <>
              <Link to="/signin" className="btn btn-secondary me-2">Sign In</Link>
              <Link to="/signup" className="btn btn-success">Sign Up</Link>
            </>
          ) : (
            <button className="btn btn-danger" onClick={() => { localStorage.removeItem("token"); setToken(null); }}>Logout</button>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<><BlogPostForm token={token} /><PostList token={token} /></>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin setToken={setToken} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
