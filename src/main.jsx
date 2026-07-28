import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ProjectProvider } from "./useContext/Project.jsx";
import { TaskProvider } from "./useContext/Task.jsx";
import { TeamProvider } from "./useContext/Teams.jsx";
import { UserProvider } from "./useContext/User.jsx";
import App from "./App.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import TaskPage from "./pages/TaskPage.jsx";
import TaskDetailPage from "./pages/TaskDetailPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import Reports from "./pages/Reports.jsx";
import Setting from "./pages/Setting.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx"; 

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TaskProvider>
      <ProjectProvider>
        <TeamProvider>
          <UserProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route 
                path="/dashboardPage" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute>
                    <ProjectPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/:projectId" 
                element={
                  <ProtectedRoute>
                    <ProjectDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <TaskPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/:taskId" 
                element={
                  <ProtectedRoute>
                    <TaskDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teams" 
                element={
                  <ProtectedRoute>
                    <TeamPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/setting" 
                element={
                  <ProtectedRoute>
                    <Setting />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </UserProvider>
        </TeamProvider>
      </ProjectProvider>
    </TaskProvider>
  </BrowserRouter>
);