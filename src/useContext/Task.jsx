import { useState, createContext, useContext } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hostedUrl = "https://workAsana-be.vercel.app/api"
  const getAllTaskDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${hostedUrl}/all-task`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch tasks");
      setTasks(data.data);
      return data.data;
    } catch (error) {
      setError(error.message);
      console.error("Task Fetch Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${hostedUrl}/add-task`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create task");
      setTasks((prev) => [...prev, data.data]);
      return data.data;
    } catch (error) {
      setError(error.message);
      console.error("Create Task Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${hostedUrl}/delete-task/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}` 
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete task");
      
      setTasks((prev) => prev.filter(t => t._id !== taskId));
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${hostedUrl}/update-task/${taskId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update task");
      
      setTasks((prev) => prev.map(t => t._id === taskId ? data.data : t));
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, error, getAllTaskDetails, createTask, deleteTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask must be used within a TaskProvider");
  return context;
};

export default TaskContext;