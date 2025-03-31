import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CardHeader, CardContent, CardFooter, CardDescription, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  onSwitchTab: (tab: string) => void;
}

export const LoginForm = ({ onSubmit, onSwitchTab }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">User name</Label>
          <Input
            id="login-email"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            {/* <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link> */}
          </div>
          <div className="relative">
            <Input
              id="login-password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full">Sign In</Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => onSwitchTab("signup")}
          >
            Sign up
          </button>
        </div>
      </CardFooter>
    </form>
  );
};
