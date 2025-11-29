import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import HomePage from '../pages/Home';
import PostDetailPage from '../pages/PostDetail';
import TagPostsPage from '../pages/TagPosts';
import AboutPage from '../pages/About';
import AdminLoginPage from '../pages/admin/Login';
import AdminPostsPage from '../pages/admin/Posts';
import AdminPostEditorPage from '../pages/admin/PostEditor';
import AdminTagsPage from '../pages/admin/Tags';
import AdminSettingsPage from '../pages/admin/Settings';
import { ProtectedRoute } from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts/:slug" element={<PostDetailPage />} />
      <Route path="/tags/:slug" element={<TagPostsPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Route>
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="posts" element={<AdminPostsPage />} />
      <Route path="posts/new" element={<AdminPostEditorPage />} />
      <Route path="posts/:id/edit" element={<AdminPostEditorPage />} />
      <Route path="tags" element={<AdminTagsPage />} />
      <Route path="settings" element={<AdminSettingsPage />} />
      <Route path="" element={<Navigate to="/admin/posts" replace />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
