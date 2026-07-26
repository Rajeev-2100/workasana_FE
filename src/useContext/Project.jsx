import { useState, createContext, useContext } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
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
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch projects");
      setProjects(data.data);
      return data.data;
    } catch (error) {
      setError(error.message);
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
      if (!response.ok) throw new Error(data.error || "Failed to fetch users");
      setUsers(data?.data);
      return data.data;
    } catch (error) {
      setError(error.message);
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
      if (!response.ok) throw new Error(data.error || "Failed to fetch teams");
      setTeams(data.data);
      return data.data;
    } catch (error) {
      setError(error.message);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to create project");
      setProjects((prev) => [...prev, data.data]);
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Delete Project
  // ===========================
  const deleteProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${hostedUrl}/delete-project/${projectId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to delete project");

      // Remove from local state immediately
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Update Project
  // ===========================
  const updateProject = async (projectId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${hostedUrl}/update-project/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      console.log('Response:', response)
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to update project");

      // Update local state immediately
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? data?.data : p)),
      );
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        users,
        teams,
        loading,
        error,
        getAllProjectDetails,
        getAllUserDetails,
        getAllTeamDetails,
        createProject,
        deleteProject,
        updateProject,
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
