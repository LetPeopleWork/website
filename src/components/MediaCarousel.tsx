import { useState } from "react";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  alt: string;
}

interface MediaCarouselProps {
  mediaItems: MediaItem[];
  className?: string;
  showNavigation?: boolean;
  showIndicators?: boolean;
  enableModal?: boolean;
  posterImage?: string;
}

const MediaCarousel = ({ 
  mediaItems, 
  className = "", 
  showNavigation = true, 
  showIndicators = true,
  enableModal = true,
  posterImage
}: MediaCarouselProps) => {
  const [currentMedia, setCurrentMedia] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageAlt, setModalImageAlt] = useState("");

  const openImageModal = (src: string, alt: string) => {
    if (!enableModal) return;
    setModalImageSrc(src);
    setModalImageAlt(alt);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageSrc("");
    setModalImageAlt("");
  };

  const nextMedia = () => {
    setCurrentMedia((prev) => (prev + 1) % mediaItems.length);
  };

  const prevMedia = () => {
    setCurrentMedia((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const renderImage = () => {
    if (enableModal) {
      return (
        <button
          onClick={() => openImageModal(currentItem.src, currentItem.alt)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openImageModal(currentItem.src, currentItem.alt);
            }
          }}
          className="relative rounded-lg shadow-medium hover:shadow-glow transition-all duration-300 w-full h-full cursor-pointer hover:scale-[1.02] bg-transparent border-0 p-0 flex items-center justify-center"
          aria-label={`Expand ${currentItem.alt}`}
        >
          <img 
            src={currentItem.src} 
            alt={currentItem.alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            loading="lazy"
            width="800"
            height="600"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-lg">
            <div className="bg-white/90 rounded-full px-3 py-1">
              <span className="text-sm font-medium text-gray-900">Click to expand</span>
            </div>
          </div>
        </button>
      );
    }
    
    return (
      <div className="relative rounded-lg shadow-medium hover:shadow-glow transition-all duration-300 w-full h-full flex items-center justify-center">
        <img 
          src={currentItem.src} 
          alt={currentItem.alt}
          className="max-w-full max-h-full object-contain rounded-lg"
          loading="lazy"
          width="800"
          height="600"
        />
      </div>
    );
  };

  if (mediaItems.length === 0) return null;

  const currentItem = mediaItems[currentMedia];

  return (
    <>
      <div className={`relative group ${className}`}>
        <div className="absolute -inset-2 bg-gradient-primary rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
        
        {currentItem.type === "image" ? (
          renderImage()
        ) : (
          <div className="relative rounded-lg overflow-hidden shadow-medium hover:shadow-glow transition-all duration-300 flex items-center justify-center">
            <video
              src={currentItem.src}
              className="max-w-full max-h-full object-contain"
              title={currentItem.alt}
              controls
              preload="metadata"
              poster={posterImage}
              width="800"
              height="600"
            >
              <track kind="captions" srcLang="en" label="English captions" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        {/* Navigation buttons */}
        {showNavigation && mediaItems.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors z-10"
              aria-label="Previous media"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors z-10"
              aria-label="Next media"
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </button>
          </>
        )}
        
        {/* Media type indicator */}
        {showIndicators && mediaItems.length > 1 && (
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-primary flex items-center space-x-1">
            {currentItem.type === "video" ? <PlayCircle className="h-4 w-4" /> : <span>📷</span>}
            <span>{currentMedia + 1}/{mediaItems.length}</span>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && enableModal && (
        <dialog 
          open
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm border-0 p-0 w-full h-full max-w-none max-h-none" 
          aria-labelledby="modal-title"
        >
          <div className="relative max-w-[90vw] max-h-[90vh] p-4">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={modalImageSrc}
              alt={modalImageAlt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              id="modal-title"
            />
          </div>
          {/* Background overlay that closes modal when clicked */}
          <button 
            className="absolute inset-0 -z-10 bg-transparent border-0 cursor-pointer"
            onClick={closeModal}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeModal();
              } else if (e.key === 'Escape') {
                closeModal();
              }
            }}
            aria-label="Close modal by clicking background"
          />
        </dialog>
      )}
    </>
  );
};

export default MediaCarousel;
