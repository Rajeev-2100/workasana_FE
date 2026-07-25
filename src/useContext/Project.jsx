import { useState, createContext, useContext } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base API URL
  const hostedUrl = "http://localhost:3000/api";

  // ===========================
  // Get All Projects
  // ===========================
  const getAllProjectDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${hostedUrl}/all-project`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch projects");
      }

      setProjects(data.data);
      return data.data;
    } catch (error) {
      setError(error.message);
      console.error("Project Fetch Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Get All Tasks
  // ===========================
  const getAllTaskDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${hostedUrl}/all-task`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tasks");
      }

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
  // Get All Users
  // ===========================
  const getAllUserDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${hostedUrl}/all-user`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsers(data?.data);
      return data.data;
    } catch (error) {
      setError(error.message);
      console.error("User Fetch Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Get All Teams
  // ===========================
  const getAllTeamDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${hostedUrl}/all-team`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch teams");
      }

      setTeams(data.data);
      return data.data;
    } catch (error) {
      setError(error.message);
      console.error("Team Fetch Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Create Project
  // ===========================
  const createProject = async (projectData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${hostedUrl}/add-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      setProjects((prev) => [...prev, data.data]);
      return data.data;
    } catch (error) {
      setError(error.message);
      console.error("Create Project Error:", error);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }

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

  // console.log("Projects:", projects);
  // console.log("Tasks:", tasks);
  // console.log("Users:", users);
  // console.log("Teams:", teams);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        tasks,
        users,
        teams,
        loading,
        error,
        getAllProjectDetails,
        getAllTaskDetails,
        getAllUserDetails,
        getAllTeamDetails,
        createProject,
        createTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }

  return context;
};

export default ProjectContext;