import React from "react";
import { Button } from "@/components/ui/button";

const BookingBar: React.FC = () => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-100 py-4 px-4 z-[9999] shadow-sm"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3 h-full">
          <div className="text-gray-700 text-[12px] flex-[3]">
            <div>04-19 13:00부터 예약가능</div>
          </div>

          <div className="flex-[1] flex items-center justify-center py-0">
            <button className="w-full bg-black text-white font-bold py-3 text-[14px] rounded-md">
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingBar;
