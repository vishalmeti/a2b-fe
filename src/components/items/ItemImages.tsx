import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ItemImagesProps {
  images: string[];
  name: string;
}

export function ItemImages({ images, name }: ItemImagesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative overflow-hidden rounded-lg aspect-video bg-muted">
      <img
        src={images[currentImageIndex]}
        alt={name}
        className="object-cover w-full h-full"
      />
      
      {images.length > 1 && (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
            onClick={handlePrevImage}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
            onClick={handleNextImage}
          >
            <ArrowLeft className="h-4 w-4 transform rotate-180" />
          </Button>
        </>
      )}
      
      <div className="absolute bottom-2 right-2 flex space-x-1">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setCurrentImageIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
