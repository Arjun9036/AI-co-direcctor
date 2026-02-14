import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#222", color: "#fff" }}>
      <Link to="/" style={{ marginRight: "1rem", color: "white" }}>Home</Link>
      <Link to="/signup" style={{ marginRight: "1rem", color: "white" }}>Signup</Link>
      <Link to="/login" style={{ color: "white" }}>Login</Link>
    </nav>
  );
}