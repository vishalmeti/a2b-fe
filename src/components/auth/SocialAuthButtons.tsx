import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SocialAuthButtons = () => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button">Google</Button>
        <Button variant="outline" type="button">Facebook</Button>
      </div>
    </div>
  );
};

export default SocialAuthButtons;
