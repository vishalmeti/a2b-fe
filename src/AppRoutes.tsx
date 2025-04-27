import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect, useState, startTransition, useTransition } from "react";
import NavBar from "@/components/NavBar";

// Lazy load pages for better performance
const HomePage = lazy(() => import("@/pages/Index"));
const BrowsePage = lazy(() => import("@/pages/Browse"));
const CommunitiesPage = lazy(() => import("@/pages/Communities"));
const RequestsPage = lazy(() => import("@/pages/RequestsReceived"));
const NotificationPage = lazy(() => import("@/pages/Notifications"));
// const MyItemsPage = lazy(() => import("@/pages/MyItemsPage"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
// const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NewListingPage = lazy(() => import("@/pages/NewListing"));
const LoginPage = lazy(() => import("@/pages/Auth"));
const RegisterPage = lazy(() => import("@/pages/Auth"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const ItemDetailsPage = lazy(() => import("@/pages/ItemDetail"));
const RequestTrackingPage = lazy(() => import("@/pages/RequestTrackingPage"));
const LoadingScreen = lazy(() => import("@/components/loader/LoadingScreen"));


// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Replace with your actual authentication check
    const token = localStorage.getItem("token");
    startTransition(() => {
      setIsAuthenticated(!!token);
    });
  }, []);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return <LoadingScreen baseMessage="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const [isPending, startTransition] = useTransition();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* <NavBar /> */}
      <main className="flex-1">
        {isPending && <LoadingScreen baseMessage="Loading page..." />}
        <Suspense fallback={<LoadingScreen baseMessage="Loading..." />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/browse" element={<BrowsePage />} /> */}
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}

            <Route path="/browse" element={
              <ProtectedRoute>
                <BrowsePage />
              </ProtectedRoute>
            } />

            <Route path="settings/notifications" element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            } />

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
            <Route path="/requests/:requestId/tracking" element={
              <ProtectedRoute>
                <RequestTrackingPage />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="w-full py-6 bg-muted dark:bg-slate-800">
        <div className="container px-4 md:px-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Borrow Anything. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppRoutes;
