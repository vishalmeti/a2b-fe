import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent } from "react";

interface AboutCardProps {
  bio: string;
  editMode: boolean;
  formData: {
    bio: string;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const AboutCard: React.FC<AboutCardProps> = ({
  bio,
  editMode,
  formData,
  handleInputChange,
}) => {
  return (
    <Card className="shadow-sm dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/60">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">About</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[120px]">
          {editMode ? (
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell the community about yourself..."
              rows={6}
              className="w-full text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-transparent border-0 border-b border-gray-400 dark:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary p-0 resize-none min-h-[120px]"
            />
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed p-0">
              {bio || "No bio available."}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
