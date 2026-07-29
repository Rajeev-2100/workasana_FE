import { useState, createContext, useContext } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base API URL
  const hostedUrl = "https://workasana-be-three.vercel.app";

  // ===========================
  // Get All Tasks
  // ===========================
  const getAllTaskDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${hostedUrl}/all-task`);
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

  // ===========================
  // Create Task
  // ===========================
  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${hostedUrl}/add-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // ===========================
  // Delete Task
  // ===========================
  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${hostedUrl}/delete-task/${taskId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete task");
      
      // Remove from local state immediately
      setTasks((prev) => prev.filter(t => t._id !== taskId));
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Update Task
  // ===========================
  const updateTask = async (taskId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${hostedUrl}/update-task/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update task");
      
      // Update local state immediately
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
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        getAllTaskDetails,
        createTask,
        deleteTask,   
        updateTask,  
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export default TaskContext;