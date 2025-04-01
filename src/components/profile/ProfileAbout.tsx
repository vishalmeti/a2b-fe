import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ProfileAboutProps {
  bio: string;
  editMode: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfileAbout = ({ bio, editMode, handleInputChange }: ProfileAboutProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">About</CardTitle>
      </CardHeader>
      <CardContent>
        {editMode ? (
          <Textarea
            name="bio"
            value={bio}
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
        ) : (
          <p className="text-muted-foreground">{bio}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileAbout;
