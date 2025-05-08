import React, { useState } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { format, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 날짜/시간 선택 컴포넌트
const DateTimeSelector: React.FC = () => {
  // 예약 상태 스토어에서 필요한 상태와 액션 가져오기
  const { selectedDate, selectedTime, setDate, setTime, setStep } =
    useBookingStore();

  // 오늘 날짜 기준으로 7일간의 날짜 생성
  const today = new Date();
  const availableDates = Array.from({ length: 7 }, (_, i) =>
    addDays(today, i)
  );

  // 시간 슬롯 (예시 데이터)
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date) => {
    setDate(date);
  };

  // 시간 선택 핸들러
  const handleTimeSelect = (time: string) => {
    setTime(time);
    
    // 날짜와 시간이 모두 선택되었으면 확인 단계로 이동
    if (selectedDate) {
      setStep("confirmation");
    }
  };

  return (
    <div className="px-4 py-5">
      <h2 className="text-xl font-bold mb-4">Select Date & Time</h2>

      {/* 날짜 선택 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Date</h3>
        <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
          {availableDates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-lg ${
                selectedDate && isSameDay(selectedDate, date)
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              <span className="text-sm">
                {format(date, "EEE")}
              </span>
              <span className="text-lg font-bold">
                {format(date, "d")}
              </span>
              <span className="text-xs">
                {format(date, "MMM")}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 시간 선택 (날짜가 선택된 경우에만 표시) */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium mb-3">Time</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`p-3 rounded-lg text-center ${
                  selectedTime === time
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;
