import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./todo.css";

const Todo = ({ handleLogout }) => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);

  // Fetch todos from the server
  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/todos/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setItems(data);
      } else {
        toast.error(data.message || "Failed to fetch todos");
      }
    } catch (error) {
      console.error("Fetch todos error:", error);
      toast.error("Something went wrong");
    }
  };

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle adding a new todo
  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title }),
      });

      const data = await response.json();
      console.log(data._id);
      if (response.ok) {
        toast.success("Todo added successfully!");
        setItems((prevItems) => [...prevItems, data]);
        setTitle(""); // clear input after add
      } else {
        toast.error(data.message || "Failed to add todo");
      }
    } catch (err) {
      console.error("Add todo error:", err);
      toast.error("Something went wrong");
    }
  };

  // Handle deleting a todo
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        fetchTodos();
        toast.success(response.message || "Todo deleted successfully!");
      }
    } catch (err) {
      console.error("Delete todo error:", err);
      toast.error("Something went wrong");
    }
  };

  const logout = async () => {
    handleLogout();
  };

  return (
    <div className="container">
      <h2>Your Todo List</h2>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {items.map((task) => (
          <li key={task._id}>
            {task.title}
            <button
              className="delete-task"
              onClick={() => handleDeleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button className="logout-button" onClick={logout}>
        Logout
      </button>
      <ToastContainer />
    </div>
  );
};

export default Todo;
