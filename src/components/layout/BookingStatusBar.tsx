import React from "react";
import { useBookingStore } from "@/store/bookingStore";

// BookingStatusBar로 이름 변경 (BookNowBar에서 변경)
const BookingStatusBar: React.FC = () => {
  // 예약 상태 가져오기
  const {
    step,
    selectedServices,
    selectedDate,
    selectedTime,
    setStep,
  } = useBookingStore();

  // 버튼 텍스트 결정
  const getButtonText = () => {
    switch (step) {
      case "initial":
        return "Book now";
      case "service-selection":
      case "datetime-selection":
        return "Continue";
      case "confirmation":
        return "Confirm Booking";
      case "completed":
        return "Book Again";
      default:
        return "Book now";
    }
  };

  // 왼쪽 정보 텍스트 결정
  const getInfoText = () => {
    switch (step) {
      case "initial":
        return "04-19 13:00부터 예약가능";
      case "service-selection":
        return `${selectedServices.length}개 서비스 선택됨`;
      case "datetime-selection":
        return `${selectedServices.length}개 서비스 | ${
          selectedDate ? selectedDate.toLocaleDateString() : "날짜 선택 필요"
        }`;
      case "confirmation":
        return `${selectedServices.length}개 서비스 | ${
          selectedDate ? selectedDate.toLocaleDateString() : ""
        } ${selectedTime || ""}`;
      case "completed":
        return "예약이 완료되었습니다";
      default:
        return "04-19 13:00부터 예약가능";
    }
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = () => {
    switch (step) {
      case "initial":
        setStep("service-selection");
        break;
      case "service-selection":
        setStep("datetime-selection");
        break;
      case "datetime-selection":
        setStep("confirmation");
        break;
      case "confirmation":
        setStep("completed");
        // 여기에 실제 예약 처리 로직 추가 (Firebase 등)
        break;
      case "completed":
        setStep("initial");
        break;
    }
  };

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
            <div>{getInfoText()}</div>
          </div>

          <div className="flex-[1] flex items-center justify-center py-0">
            <button
              className="w-full bg-black text-white font-bold py-3 text-[14px] rounded-md"
              onClick={handleButtonClick}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStatusBar;
