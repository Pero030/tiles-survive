import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';

const HomePage = lazy(() => import('../pages/HomePage.jsx'));
const CollectionPage = lazy(() => import('../pages/CollectionPage.jsx'));
const DetailPage = lazy(() => import('../pages/DetailPage.jsx'));
const FaqPage = lazy(() => import('../pages/FaqPage.jsx'));
const PatchesPage = lazy(() => import('../pages/PatchesPage.jsx'));
const UserLoginPage = lazy(() => import('../pages/UserLoginPage.jsx'));
const ChatPage = lazy(() => import('../pages/ChatPage.jsx'));
const ForumPage = lazy(() => import('../pages/ForumPage.jsx'));
const AdminLoginPage = lazy(() => import('../pages/AdminLoginPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<CollectionPage type="event" />} />
        <Route path="events/:slug" element={<DetailPage type="event" />} />
        <Route path="heroes" element={<CollectionPage type="hero" />} />
        <Route path="heroes/:slug" element={<DetailPage type="hero" />} />
        <Route path="villages" element={<CollectionPage type="village" />} />
        <Route path="villages/:slug" element={<DetailPage type="village" />} />
        <Route path="alliance" element={<CollectionPage type="alliance" />} />
        <Route path="alliance/:slug" element={<DetailPage type="alliance" />} />
        <Route path="buildings" element={<CollectionPage type="building" />} />
        <Route path="buildings/:slug" element={<DetailPage type="building" />} />
        <Route path="world-map" element={<CollectionPage type="map" />} />
        <Route path="patches" element={<PatchesPage />} />
        <Route path="tips" element={<CollectionPage type="tip" />} />
        <Route path="tips/:slug" element={<DetailPage type="tip" />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="login" element={<UserLoginPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="forum" element={<ForumPage />} />
        <Route path="secret-admin" element={<AdminLoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
