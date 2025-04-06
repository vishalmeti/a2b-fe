import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import NavBar from "@/components/NavBar";

// Lazy load pages for better performance
const HomePage = lazy(() => import("@/pages/Index"));
const BrowsePage = lazy(() => import("@/pages/Browse"));
const CommunitiesPage = lazy(() => import("@/pages/Communities"));
const RequestsPage = lazy(() => import("@/pages/RequestsReceived"));
// const MyItemsPage = lazy(() => import("@/pages/MyItemsPage"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
// const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NewListingPage = lazy(() => import("@/pages/NewListing"));
const LoginPage = lazy(() => import("@/pages/Auth"));
const RegisterPage = lazy(() => import("@/pages/Auth"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const ItemDetailsPage = lazy(() => import("@/pages/ItemDetail"));

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Replace with your actual authentication check
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <NavBar /> */}
      <main className="flex-1">
        <Suspense fallback={<div className="container py-8">Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/requests-received" element={
              <ProtectedRoute>
                <RequestsPage />
              </ProtectedRoute>
            } />
            {/* <Route path="/my-items" element={
              <ProtectedRoute>
                <MyItemsPage />
              </ProtectedRoute>
            } /> */}
            <Route path="/items/:id" element={
                <ProtectedRoute>
                    <ItemDetailsPage />
                </ProtectedRoute>
            } />
            <Route path="/profile/:id" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            {/* <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } /> */}
            <Route path="/new-listing" element={
              <ProtectedRoute>
                <NewListingPage />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Shard-IT. All rights reserved.
      </footer>
    </div>
  );
};

export default AppRoutes;
