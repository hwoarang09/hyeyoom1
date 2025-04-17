import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              <span className="hover:text-gray-900 cursor-pointer">Home</span> •
              <span className="hover:text-gray-900 cursor-pointer">
                Hair Salons
              </span>{" "}
              •
              <span className="hover:text-gray-900 cursor-pointer">
                Singapore
              </span>{" "}
              •
              <span className="hover:text-gray-900 cursor-pointer">
                Tanglin
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
