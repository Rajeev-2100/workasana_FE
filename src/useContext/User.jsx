import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

// ✅ Helper function to get user synchronously from localStorage
// This runs immediately on first render, preventing the "flash of login page"
const getInitialUser = () => {
  try {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser && storedUser !== "undefined" && storedUser !== "null") {
      const parsedUser = JSON.parse(storedUser);
      const validId = parsedUser?._id || parsedUser?.id;
      
      if (validId && validId !== "undefined" && validId !== "null") {
        return {
          ...parsedUser,
          _id: validId,
          id: validId,
        };
      }
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
  }
  
  // Cleanup if data is corrupted or missing
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return null;
};

export const UserProvider = ({ children }) => {
  // ✅ FIX: Lazy initialization prevents flickering
  const [user, setUser] = useState(getInitialUser);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hostedUrl = "https://workasana-be.vercel.app/api";

  // User Register
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${hostedUrl}/add-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Registration failed");

      const userData = {
        id: data?.user?.id || data?.user?._id,
        _id: data?.user?._id || data?.user?.id,
        name: data?.user?.name || "",
        email: data?.user?.email || "",
        role: data?.user?.role || "admin",
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${hostedUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Login failed");

      const userData = {
        id: data?.user?.id || data?.user?._id,
        _id: data?.user?._id || data?.user?.id,
        name: data?.user?.name || "",
        email: data?.user?.email || "",
        role: data?.user?.role || "user",
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get All User Details
  const getAllUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const response = await fetch(`${hostedUrl}/all-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to fetch users");

      setUsers(data?.data || []);
      return data?.data || [];
    } catch (error) {
      console.error("Get all users error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User Update Profile
  const updateProfile = async (userId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${hostedUrl}/update-user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update profile");

      const updatedUser = {
        ...user,
        ...data?.data,
        id: data?.data?._id || data?.data?.id || user?.id,
        _id: data?.data?._id || data?.data?.id || user?._id,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return data;
    } catch (error) {
      console.error("Update profile error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User Change Password
  const changePassword = async (userId, currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${hostedUrl}/change-password/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to change password");
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User Delete Account
  const deleteAccount = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${hostedUrl}/delete-user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete account");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUsers([]);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        users,
        loading,
        error,
        login,
        register,
        getAllUserDetails,
        updateProfile,
        changePassword,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export default UserContext;