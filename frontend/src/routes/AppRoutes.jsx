import { Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from '../components/common/PrivateRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ProjectsPage from '../pages/ProjectsPage.jsx';
import ProjectDetailPage from '../pages/ProjectDetailPage.jsx';
import ProjectFormPage from '../pages/ProjectFormPage.jsx';
import TaskFormPage from '../pages/TaskFormPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<ProjectFormPage />} />
          <Route path="/projects/:slug/edit" element={<ProjectFormPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          {/* Task form routes — projectSlug scopes the task */}
          <Route path="/projects/:projectSlug/tasks/new" element={<TaskFormPage />} />
          <Route path="/projects/:projectSlug/tasks/:taskId/edit" element={<TaskFormPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
