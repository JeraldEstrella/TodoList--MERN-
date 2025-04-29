import React, { useState } from "react"; // ⬅️ Make sure to import useState
import Todo from "./components/Todo";
import Login from "./components/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ⬅️ State for auth

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Login successful!");
        setIsAuthenticated(true);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleSumbitLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(false);
        toast.success("Logout successful!");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <Todo handleLogout={handleSumbitLogout} />
      ) : (
        <Login handleLogin={handleLogin} />
      )}
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default App;
