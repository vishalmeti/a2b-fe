import { useState, useEffect } from "react";
import { ArrowLeft, X } from "lucide-react";

interface Image {
  image_url: string;
  caption?: string;
}

interface ItemImageCarouselProps {
  images: Image[];
}

export const ItemImageCarousel = ({ images }: ItemImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div 
        className="aspect-[16/9] w-full cursor-pointer"
        onClick={() => images.length > 0 && setIsModalOpen(true)}
      >
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

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-[800px] h-[600px] bg-black/30 rounded-lg mx-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Image container */}
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={images[currentImageIndex].image_url}
                alt={images[currentImageIndex].caption || "Item image"}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Caption */}
              {images[currentImageIndex]?.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">
                  {images[currentImageIndex].caption}
                </div>
              )}
            </div>
            
            {/* Modal navigation */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all"
                  aria-label="Next image"
                >
                  <ArrowLeft className="h-6 w-6 rotate-180" />
                </button>
                
                {/* Image counter */}
                <div className="absolute top-3 left-3 bg-black/50 text-white text-sm px-3 py-1 rounded-md">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemImageCarousel;
