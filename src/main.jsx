import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ProjectProvider } from "./useContext/Project.jsx";
import App from "./App.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import Team from "./pages/TeamPage.jsx";
import Reports from "./pages/Reports.jsx";
import Setting from "./pages/Setting.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import TaskDetailPage from "./pages/TaskDetailPage.jsx";
import TaskPage from "./pages/TaskPage.jsx";
import { TaskProvider } from "./useContext/Task.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import { TeamProvider } from "./useContext/Teams.jsx";
import { UserProvider } from "./useContext/User.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TaskProvider>
      <ProjectProvider>
        <TeamProvider>
          <UserProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/dashboardPage" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
              <Route path="/teams" element={<TeamPage />} />
              <Route path="/tasks" element={<TaskPage />} />
              <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/setting" element={<Setting />} />
            </Routes>
          </UserProvider>
        </TeamProvider>
      </ProjectProvider>
    </TaskProvider>
  </BrowserRouter>,
);
