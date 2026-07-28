import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hostedUrl = "http://localhost:3000/api";

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      console.log("🔍 Token:", token);
      console.log("🔍 StoredUser:", storedUser);
      
      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("✅ User loaded from localStorage:", parsedUser);
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Failed to parse user from localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

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
      
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const userData = {
        id: data.user.id || data.user._id,
        _id: data.user._id || data.user.id,
        name: data.user.name || "",
        email: data.user.email || "",
        role: data.user.role || "admin",
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
      
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const userData = {
        id: data.user.id || data.user._id,
        _id: data.user._id || data.user.id,
        name: data.user.name || "",
        email: data.user.email || "",
        role: data.user.role || "user",
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      console.log("✅ Login successful:", userData);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get All User Details - FIXED
  const getAllUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(`${hostedUrl}/all-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("📦 All Users Response:", data);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch users");
      }

      const usersData = data?.data || [];
      
      setUsers(usersData);
      
      return usersData;
    } catch (error) {
      console.error("❌ Get all users error:", error);
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
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${hostedUrl}/update-user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      const updatedUser = {
        ...user,
        ...data?.data,
        id: data.data?._id || data.data?.id || user?.id,
        _id: data.data?._id || data.data?.id || user?._id,
      };

      console.log("👤 Updated User:", updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return data;
    } catch (error) {
      console.error("❌ Update profile error:", error);
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
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${hostedUrl}/change-password/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }
      
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
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${hostedUrl}/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

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
    console.log("✅ User logged out");
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
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;