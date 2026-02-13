'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imgSrc: string;
  title: string;
  details: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  imgSrc,
  title,
  details,
}) => {
  const [detailsObj, setDetailsObj] = useState<Record<string, string>>({});

  useEffect(() => {
    if (details) {
      setDetailsObj(JSON.parse(details));
    }
  }, [details]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="image-modal"
      className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        id="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
          <Image
            id="modal-image"
            src={imgSrc}
            alt="Vista detallada del proyecto"
            width={800}
            height={800}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <h2
            id="modal-title"
            className="text-3xl font-bold text-purple-800 mb-4"
          >
            {title}
          </h2>
          <div id="modal-details" className="space-y-3 text-gray-700 flex-grow">
            {Object.entries(detailsObj).map(([key, value]) => (
              <p key={key}>
                <strong className="text-purple-600">{key}:</strong> {value}
              </p>
            ))}
          </div>
          <button
            id="close-modal-button"
            className="mt-6 self-start bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
