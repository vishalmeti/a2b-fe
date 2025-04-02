import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Settings, MessageSquare, LogOut } from "lucide-react";

export const AccountCard: React.FC = () => {
  return (
    <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Account</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <nav className="flex flex-col text-sm space-y-1">
          {/* Profile Settings Link */}
          <Link to="/settings/profile"
                className="flex items-center w-full rounded-md px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
            <UserCircle className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            <span>Profile Settings</span>
          </Link>

          {/* Account Settings Link */}
          <Link to="/settings/account"
                className="flex items-center w-full rounded-md px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
            <Settings className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            <span>Account Settings</span>
          </Link>

          {/* Notifications Link */}
          <Link to="/settings/notifications"
                className="flex items-center w-full rounded-md px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
            <MessageSquare className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            <span>Notifications</span>
          </Link>

          {/* Sign Out Button */}
          <button className="flex items-center w-full text-left rounded-md px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150 mt-2">
            <LogOut className="h-5 w-5 mr-3" />
            <span>Sign Out</span>
          </button>
        </nav>
      </CardContent>
    </Card>
  );
};
