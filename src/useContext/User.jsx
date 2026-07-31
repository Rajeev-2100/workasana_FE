import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router'

export const UserContext = createContext();

const getInitialUser = () => {
  try {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (
      token &&
      storedUser &&
      storedUser !== "undefined" &&
      storedUser !== "null"
    ) {
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

  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return null;
};

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(getInitialUser);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignup, setIsSignup] = useState(true);
  const [messageType, setMessageType] = useState("");

  const hostedUrl = "https://workAsana-be.vercel.app/api";

  // User Register
  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please enter name, email, and password");
      setMessageType("error");
      return;
    }
    try {
      const response = await fetch(`${hostedUrl}/add-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Signup Successful. Please Login.");
        setMessageType("success");
        setIsSignup(false);
        localStorage.setItem("token", data?.token);
        localStorage.setItem("user", JSON.stringify(data?.user));
        setName("");
        setEmail("");
        setPassword("");
      } else {
        toast.error(data.error || "Signup failed");
        setMessage(data.error || "Signup failed");
        setMessageType("error");
      }
    } catch (error) {
      toast.error("Network Error. Please try again.");
      setMessageType("error");
    }
  };

  // User Login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      setMessageType("error");
      return;
    }
    try {
      const response = await fetch(`${hostedUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Login Successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login Successful");
        setMessageType("success");
        navigate("/dashboardPage");
      } else {
        toast.error(data.error || "Login failed");
        setMessage(data.error || "Login failed");
        setMessageType("error");
      }
    } catch (error) {
      toast.error("Network Error. Please try again.");
      setMessageType("error");
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
      if (!token) {
        toast.error("No authentication token found");
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
        toast.error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");

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
      if (!token) {
        toast.error("No authentication token found");
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
        toast.error("Failed to change password");
      }
      toast.success("Password change successfully");
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
        toast.error("No authentication token found");
      }

      const response = await fetch(`${hostedUrl}/delete-user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error("Failed to delete account");
      }
      toast.success("User detail deleted successfully");
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
        name,
        email,
        password,
        isSignup,
        message,
        messageType,
        hostedUrl,

        setName,
        setEmail,
        setPassword,
        setIsSignup,
        setMessage,
        setMessageType,

        handleSignup,
        handleLogin,
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
