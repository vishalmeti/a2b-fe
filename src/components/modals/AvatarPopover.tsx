import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogIn, User as UserIcon } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchUser } from '@/store/slices/userSlice';

import { useEffect } from "react";

interface AvatarPopoverProps {
  onLogout: () => void;
}

export const AvatarPopover = ({ onLogout }: AvatarPopoverProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    if(!data?.profile_picture_url) {
      dispatch(fetchUser());
    }
  }, [data?.profile_picture_url, dispatch]);
  
  
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={data?.profile_picture_url} alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/profile')}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={onLogout}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
