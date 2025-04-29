import React, { useState, useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, onSave, title, children, width = "w-[800px]", height = "max-h-[90vh]" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);
  const headerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {   
    if (isOpen) {
      setPosition({ x: 0, y: 0 }); // Reset position when modal opens
    }

    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        setPosition((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));
        setStartPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startPos]);

  const handleMouseDown = (e) => {
    if (e.target === headerRef.current) {
      setIsDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  const handleSaveWithLoading = () => {
    setIsLoading(true);
    onSave();
    // Simulate async operation (replace with actual logic)
    setTimeout(() => setIsLoading(false), 1000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4"
      onClick={handleOverlayClick}
      ref={modalRef}
    >
      <div
        className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl ${width} ${height} flex flex-col overflow-hidden animate-fadeInScale relative`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          touchAction: isDragging ? "none" : "auto",
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="flex items-center justify-between px-8 py-4 order-b bg-gradient-to-r from-teal-500/10 to-blue-100/10 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-2xl font-bold text-gray-900 drop-shadow-sm">
            {title || "Edit Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 transition-colors text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-full p-2 hover:bg-gray-100/50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-gray-50/80 backdrop-blur-sm space-y-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-4 px-8 py-5 border-t bg-white/90">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl border border-gray-300 hover:bg-gray-100/50 text-gray-800 text-base font-medium transition-all shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveWithLoading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-base font-semibold transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Animation Keyframes
const styles = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fadeInScale {
    animation: fadeInScale 0.3s ease-out forwards;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Modal;
