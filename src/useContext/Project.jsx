import { useState, createContext, useContext } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hostedUrl = "https://workAsana-be.vercel.app/api"
  const getAllProjectDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${hostedUrl}/all-project`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch projects");
      setProjects(data?.data);
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${hostedUrl}/add-project`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create project");
      setProjects((prev) => [...prev, data.data]);
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${hostedUrl}/delete-project/${projectId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}` 
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete project");

      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${hostedUrl}/update-project/${projectId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update project");

      setProjects((prev) => prev.map((p) => (p._id === projectId ? data?.data : p)));
      return data.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, loading, error, createProject, deleteProject, updateProject, getAllProjectDetails }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProjects must be used within a ProjectProvider");
  return context;
};

export default ProjectContext;