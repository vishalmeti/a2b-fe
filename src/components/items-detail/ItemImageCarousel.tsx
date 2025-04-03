import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface Image {
  image_url: string;
  caption?: string;
}

interface ItemImageCarouselProps {
  images: Image[];
}

export const ItemImageCarousel = ({ images }: ItemImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="aspect-[16/9] w-full">
        {
          images.length > 0 ? (
            <img
              src={images[currentImageIndex].image_url}
              alt={images[currentImageIndex].caption || "Item image"}
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src="https://placehold.co/600x400?text=No+Image"
              alt="No image available"
              className="w-full h-full object-cover"
            />
          )
        }
      </div>
      
      {/* Image Navigation Controls */}
      {images.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button 
            onClick={prevImage} 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all"
            aria-label="Previous image"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={nextImage} 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all"
            aria-label="Next image"
          >
            <ArrowLeft className="h-5 w-5 rotate-180" />
          </button>
          
          {/* Image Pagination Indicators */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Image Counter */}
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
            {currentImageIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default ItemImageCarousel;
