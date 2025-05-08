import React from "react";
import { useBookingStore } from "@/store/bookingStore";
import DateTimeSelector from "./DateTimeSelector";
import BookingConfirmation from "./BookingConfirmation";
import BookingComplete from "./BookingComplete";
import { ChevronLeft, X } from "lucide-react";

// 예약 컨테이너 컴포넌트
const BookingContainer: React.FC = () => {
  // 예약 상태 스토어에서 현재 단계와 액션 가져오기
  const { step, setStep, resetBooking } = useBookingStore();

  // 뒤로 가기 핸들러
  const handleBack = () => {
    // 현재 단계에 따라 이전 단계로 이동
    switch (step) {
      case "datetime-selection":
        setStep("service-selection");
        break;
      case "confirmation":
        setStep("datetime-selection");
        break;
      case "completed":
        resetBooking();
        break;
      default:
        resetBooking();
    }
  };

  // 닫기 핸들러
  const handleClose = () => {
    // 예약 상태 초기화
    resetBooking();
  };

  // 현재 단계에 따라 다른 컴포넌트 렌더링
  const renderStepContent = () => {
    switch (step) {
      case "datetime-selection":
        return <DateTimeSelector />;
      case "confirmation":
        return <BookingConfirmation />;
      case "completed":
        return <BookingComplete />;
      default:
        return null;
    }
  };

  // 단계가 initial 또는 service-selection인 경우 아무것도 표시하지 않음
  if (step === "initial" || step === "service-selection") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white z-[9998] overflow-y-auto">
      <div className="container mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-3 p-1 rounded-full hover:bg-gray-100"
                aria-label="Back"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-xl font-bold">
                {step === "datetime-selection" && "Select Date & Time"}
                {step === "confirmation" && "Confirm Booking"}
                {step === "completed" && "Booking Complete"}
              </h1>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="pb-24">{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default BookingContainer;
