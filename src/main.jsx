import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ProjectProvider } from "./useContext/Project.jsx";
import App from "./App.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import Project from "./pages/ProjectPage.jsx"
import Team from "./pages/Team.jsx";
import Reports from "./pages/Reports.jsx";
import Setting from "./pages/Setting.jsx";
import AddNewTaskForm from "./pages/AddNewTaskForm.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ProjectProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboardPage" element={<DashboardPage />}>
          <Route path="/dashboardPage/addNewTaskForm" element={<AddNewTaskForm/>}/>
          <Route path="project" element={<Project />} />
          <Route path="team" element={<Team />} />
          <Route path="reports" element={<Reports />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Routes>
    </ProjectProvider>
  </BrowserRouter>
);