import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Settings, MessageSquare, LogOut } from "lucide-react";

const ProfileSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Link to="/settings/profile">
            <Button variant="ghost" className="w-full justify-start">
              <UserCircle className="h-4 w-4 mr-2" />
              Profile Settings
            </Button>
          </Link>
          <Link to="/settings/account">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
          </Link>
          <Link to="/settings/notifications">
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Notification Settings
            </Button>
          </Link>
          <Separator className="my-2" />
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
