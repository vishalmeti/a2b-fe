/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import { apiService } from "@/services/apiService";
import { UserRepository } from "@/repositories/User";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { fetchNotifications } from '@/store/slices/notificationSlice';
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { LoadingScreen } from "@/components/loader/LoadingScreen";

const Auth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const defaultTab = location.pathname === "/signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(value === "signup" ? "/signup" : "/login", { replace: true });
  };

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.post(UserRepository.LOGIN, { username, password });
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        dispatch(fetchNotifications());
      }
      toast({
        variant: "success",
        title: "Login successful",
        description: "Welcome back to Borrow Anything!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async ({ username, email, password, first_name, last_name }: { username: string; email: string; password: string; first_name: string; last_name: string }) => {
    setIsLoading(true);
    try {
      // Register the user
      await apiService.post(UserRepository.REGISTER, {
        username,
        email,
        password,
        first_name,
        last_name
      });

      // After successful registration, log in the user
      const loginResponse = await apiService.post(UserRepository.LOGIN, {
        username,
        password
      });

      if (loginResponse.data.access) {
        localStorage.setItem('token', loginResponse.data.access);
        dispatch(fetchNotifications());
      }

      toast({
        title: "Account created",
        description: `Welcome, ${first_name} ${last_name}!`,
      });
      
      navigate("/communities");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || "An error occurred during registration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {isLoading && <LoadingScreen baseMessage={activeTab === 'login' ? 'Logging in ..' : 'Creating your account ..'} />}
      <NavBar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md px-4 md:px-6">
          <Card className="w-full">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm onSubmit={handleLogin} onSwitchTab={handleTabChange} />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm onSubmit={handleSignup} onSwitchTab={handleTabChange} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      <footer className="w-full py-6 bg-muted">
        <div className="container px-4 md:px-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Borrow Anything. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
