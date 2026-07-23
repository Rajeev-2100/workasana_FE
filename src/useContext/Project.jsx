import { useState, createContext, useContext } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]) 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllProjectDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/all-project');
      const data = await response.json();
      
      if (response.ok) {
        setProjects(data.data);
        console.log("Projects fetched:", data.data);
        return data.data;
      } else {
        throw new Error(data.error || "Failed to fetch projects");
      }
    } catch (error) {
      setError(error.message);
      console.error("Fetch error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllTaskDetails = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/all-task')
      const data = await response.json()

      console.log('Res:',response)
      console.log('data:', data)
      
      if(response.ok){
        setTasks(data.data)
        return data.data
      }else{
        throw new Error(data.error || 'Failed to fetch tasks')
      }
    } catch (error) {
      setError(error.message)
      throw error
    } finally{
      setLoading(false)
    }
  }

  console.log('Tasks:', tasks)

  return (
    <ProjectContext.Provider value={{ projects, tasks, loading, error, getAllProjectDetails, getAllTaskDetails }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook for easy access
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};

export default ProjectContext;