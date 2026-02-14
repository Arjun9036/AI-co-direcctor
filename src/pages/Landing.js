import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome 👋</h1>
      <p>Please Signup or Login to continue</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/signup">
          <button style={{ marginRight: "10px" }}>Signup</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
}