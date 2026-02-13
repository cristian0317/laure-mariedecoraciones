'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ICategory {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  category: ICategory;
  images: string[];
}

interface ImageModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ project, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  const allImages = project?.images || [];
  const validImages = allImages.filter(Boolean); // Filter out empty strings, null, undefined
  const imagesToDisplay = validImages.length > 0 ? validImages : ['/img/logo.png']; // Fallback

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  const goToNext = useCallback(() => {
    if (imagesToDisplay.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesToDisplay.length);
    }
  }, [imagesToDisplay.length]);

  const goToPrev = useCallback(() => {
    if (imagesToDisplay.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + imagesToDisplay.length) % imagesToDisplay.length);
    }
  }, [imagesToDisplay.length]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isZoomed) {
          if (e.key === 'Escape') setIsZoomed(false);
          return;
        }
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrev();
        if (e.key === 'Escape') handleClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, isZoomed, goToNext, goToPrev, handleClose]);
  
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsZoomed(false);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (imagesToDisplay.length <= 1 || isZoomed) return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (imagesToDisplay.length <= 1 || isZoomed) return;
    const touchEndX = e.changedTouches[0].clientX;
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      goToNext();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      goToPrev();
    }
  };

  if (!isOpen && !isClosing) {
    return null;
  }

  const backdropClasses = isClosing || !isOpen ? 'opacity-0' : 'opacity-100';
  const modalClasses = isClosing || !isOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md transition-opacity duration-300 ease-in-out ${backdropClasses}`}
      onClick={handleClose}
    >
      <div
        className={`relative w-[95vw] h-[90vh] max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 ease-in-out ${modalClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Image Carousel (70%) */}
        <div 
          className="relative w-full md:w-[70%] h-1/2 md:h-full overflow-hidden bg-black"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {imagesToDisplay.map((src, index) => (
              <div key={index} className="flex-shrink-0 w-full h-full relative" onClick={() => imagesToDisplay.length > 0 && setIsZoomed(true)}>
                <Image
                  src={src}
                  alt={`Project image ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain cursor-zoom-in"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          {/* Navigation */}
          {imagesToDisplay.length > 1 && (
          <>
              <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full text-2xl hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white z-10"
              aria-label="Previous image"
              >
              &#8249;
              </button>
              <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full text-2xl hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white z-10"
              aria-label="Next image"
              >
              &#8250;
              </button>
          </>
          )}

          {/* Zoomed View Overlay (Internal) */}
          <div
            className={`absolute inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${isZoomed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsZoomed(false)}
          >
            <Image
              src={imagesToDisplay[currentIndex]}
              alt={`Project image ${currentIndex + 1} zoomed`}
              width={1920}
              height={1080}
              className="max-h-[95vh] max-w-[95vw] object-contain cursor-zoom-out"
            />
          </div>

        </div>

        {/* Right Column: Project Details (30%) */}
        <div className="relative w-full md:w-[30%] p-10 flex flex-col overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 text-gray-500 hover:text-black text-2xl z-10"
            aria-label="Close"
          >
            &times;
          </button>
          <p className="text-sm text-purple-500 font-semibold mb-2 uppercase tracking-wider">{project?.category?.name}</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{project?.title}</h2>
          <div className="flex-grow text-gray-600 space-y-4">
            <p>{project?.description}</p>
          </div>
          {imagesToDisplay.length > 1 && (
            <div className="text-center mt-6 text-gray-400 text-sm">
              {currentIndex + 1} / {imagesToDisplay.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
