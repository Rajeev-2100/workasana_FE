import { useState, createContext, useContext } from "react";

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hostedUrl = "https://workAsana-be.vercel.app/api"
  const getAllTeamDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${hostedUrl}/all-team`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch teams");
      
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

  const createTeam = async (teamData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${hostedUrl}/add-team`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(teamData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create Team");
      
      setTeams((prev) => [...prev, data.data]);
      return data.data;
    } catch (error) {
      setError(error.message);
      console.error("Create Team Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeamContext.Provider value={{ teams, loading, error, getAllTeamDetails, createTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) throw new Error("useTeam must be used within a TeamProvider");
  return context;
};

export default TeamContext;