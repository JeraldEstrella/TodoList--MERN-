import "./login.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ registerEmail, registerPassword }),
      });

      const data = await response.json();
      console.log("Register response:", data);

      if (response.ok) {
        toast.success(data.message || "Registered successfully!");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmitLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>

      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={registerEmail}
          autoComplete="email"
          onChange={(e) => setRegisterEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit">Create Account</button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
