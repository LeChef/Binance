import React, { useState, useRef, useEffect } from "react";

interface InfoButtonProps {
  content: string | React.ReactNode;
}

const InfoButton: React.FC<InfoButtonProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

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
        className="w-4 h-4 bg-gray-300 rounded-full text-gray-800 text-xs font-bold flex items-center justify-center ml-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        i
      </button>
      {isOpen && (
        <div className="absolute z-10 p-4 mt-2 bg-white rounded-lg shadow-lg text-gray-700 w-64">
          {content}
        </div>
      )}
    </div>
  );
};

export default InfoButton;
