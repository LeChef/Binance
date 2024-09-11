import React, { useState, useRef, useEffect } from "react";

interface InfoButtonProps {
  content: React.ReactNode;
}

const InfoButton: React.FC<InfoButtonProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={infoRef}>
      <button
        className="w-5 h-5 bg-gray-600 rounded-full text-white text-xs font-bold flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        i
      </button>
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-[60] p-4 mt-2 bg-gray-800 text-white rounded-lg shadow-lg w-64 sm:w-80 left-1/2 transform -translate-x-1/2"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default InfoButton;
