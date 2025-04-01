import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadModalProps {
  maxImages?: number;
  onImagesSelected: (files: File[]) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
}

export const ImageUploadModal = ({
  maxImages = 1,
  onImagesSelected,
  trigger,
  title = "Upload Profile Picture",
  description = "Select an image to upload as your profile picture.",
}: ImageUploadModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // Check if adding these files would exceed the max number of images
    if (selectedFiles.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} image${maxImages !== 1 ? "s" : ""}.`);
      return;
    }

    // Create previews for the selected files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    setSelectedFiles([...selectedFiles, ...files]);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    
    const newPreviews = [...previews];
    const newSelectedFiles = [...selectedFiles];
    
    newPreviews.splice(index, 1);
    newSelectedFiles.splice(index, 1);
    
    setPreviews(newPreviews);
    setSelectedFiles(newSelectedFiles);
  };

  const handleSubmit = () => {
    onImagesSelected(selectedFiles);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Clean up previews when closing the dialog without submitting
      previews.forEach(preview => URL.revokeObjectURL(preview));
      setSelectedFiles([]);
      setPreviews([]);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Upload Image</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {previews.map((preview, index) => (
              <div 
                key={index} 
                className="relative aspect-square rounded-md overflow-hidden border border-border"
              >
                <img 
                  src={preview} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-background/80 rounded-full p-1"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {selectedFiles.length < maxImages && (
              <label 
                htmlFor="image-upload" 
                className={cn(
                  "flex flex-col items-center justify-center aspect-square rounded-md border border-dashed border-muted-foreground p-2 cursor-pointer",
                  "hover:bg-muted transition-colors"
                )}
              >
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-center text-muted-foreground">
                  Click to upload
                </span>
                <input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="sr-only"
                />
              </label>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            {selectedFiles.length} of {maxImages} images selected
          </p>
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
