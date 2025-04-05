import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AvatarPopover } from "@/components/modals/AvatarPopover";
import { 
  Menu, Search, PlusCircle, Bell, User as UserIcon, 
  LogIn, Home, Package, Map, Settings, ClipboardList
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { NotificationsPopover } from "@/components/modals/NotificationsPopover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="mr-2 h-4 w-4" /> },
    { name: "Browse Items", path: "/browse", icon: <Search className="mr-2 h-4 w-4" /> },
    { name: "Communities", path: "/communities", icon: <Map className="mr-2 h-4 w-4" /> },
    { name: "Requests", path: "/requests-received", icon: <ClipboardList className="mr-2 h-4 w-4" /> },
  ];

  const authItems = [
    { name: "My Items", path: "/my-items", icon: <Package className="mr-2 h-4 w-4" /> },
    { name: "Profile", path: "/profile", icon: <UserIcon className="mr-2 h-4 w-4" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="mr-2 h-4 w-4" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      // Replace with actual authentication logic
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }
  , [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold text-brand-green">Shard<span className="text-brand-green-dark">-IT</span></span>
          </Link>
        </div>

        {!isMobile && (
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          {!isMobile && (
            <Link to="/browse">
              <Button variant="outline" size="sm" className="h-9 w-9 px-0">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/new-listing">
                <Button variant="ghost" size="sm" className="h-9 px-2 lg:px-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {!isMobile && "Add Item"}
                </Button>
              </Link>
              
              <NotificationsPopover />
              
              <AvatarPopover onLogout={handleLogout} />
            </>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 py-4">
                  <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                      Menu
                    </h2>
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <Link key={item.name} to={item.path}>
                          <Button
                            variant={isActive(item.path) ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start"
                          >
                            {item.icon}
                            {item.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {isAuthenticated && (
                    <div className="px-3 py-2">
                      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Account
                      </h2>
                      <div className="space-y-1">
                        {authItems.map((item) => (
                          <Link key={item.name} to={item.path}>
                            <Button
                              variant={isActive(item.path) ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start"
                            >
                              {item.icon}
                              {item.name}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!isAuthenticated && (
                    <div className="px-3 py-2">
                      <Link to="/login">
                        <Button className="w-full">
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
