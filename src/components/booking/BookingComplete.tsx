import React, { useEffect } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { useCouponStore } from "@/store/couponStore";
import { format } from "date-fns";
import { Check } from "lucide-react";

// 예약 완료 컴포넌트
const BookingComplete: React.FC = () => {
  // 예약 상태 스토어에서 필요한 상태 가져오기
  const { selectedServices, selectedDate, selectedTime, resetBooking } =
    useBookingStore();

  // 쿠폰 스토어에서 필요한 상태와 액션 가져오기
  const { selectedCouponId, useCoupon, getCouponById, resetSelectedCoupon } =
    useCouponStore();

  // 선택된 쿠폰
  const selectedCoupon = selectedCouponId
    ? getCouponById(selectedCouponId)
    : null;

  // 컴포넌트가 마운트될 때 쿠폰 사용 처리
  useEffect(() => {
    // 선택된 쿠폰이 있으면 사용 처리
    if (selectedCouponId) {
      useCoupon(selectedCouponId);
    }

    // 컴포넌트가 언마운트될 때 선택된 쿠폰 초기화
    return () => {
      resetSelectedCoupon();
    };
  }, [selectedCouponId, useCoupon, resetSelectedCoupon]);

  // 예약 번호 생성 (실제로는 서버에서 생성된 값을 사용)
  const bookingNumber = `BK-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;

  // 새 예약 시작 핸들러
  const handleNewBooking = () => {
    resetBooking();
  };

  return (
    <div className="px-4 py-5">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <Check size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 text-center mb-6">
          Your appointment has been successfully booked.
        </p>

        {/* 예약 번호 */}
        <div className="w-full p-4 bg-gray-50 rounded-lg mb-6">
          <p className="text-center">
            <span className="text-gray-600">Booking Number: </span>
            <span className="font-bold">{bookingNumber}</span>
          </p>
        </div>

        {/* 예약 상세 정보 */}
        <div className="w-full mb-6">
          <h3 className="text-lg font-medium mb-3">Booking Details</h3>

          {/* 날짜 및 시간 */}
          <div className="p-3 bg-gray-50 rounded-lg mb-3">
            <p className="font-medium">Date & Time</p>
            <p className="text-gray-600">
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </p>
            <p className="text-gray-600">{selectedTime}</p>
          </div>

          {/* 서비스 */}
          <div className="p-3 bg-gray-50 rounded-lg mb-3">
            <p className="font-medium mb-2">Services</p>
            <ul className="space-y-1">
              {selectedServices.map((service) => (
                <li key={service.id} className="text-gray-600">
                  • {service.name} ({service.duration})
                </li>
              ))}
            </ul>
          </div>

          {/* 적용된 쿠폰 (있는 경우에만 표시) */}
          {selectedCoupon && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium mb-2 flex items-center">
                <span>Applied Coupon</span>
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  {selectedCoupon.discountType === "percentage"
                    ? `${selectedCoupon.discountValue}% OFF`
                    : `SGD ${selectedCoupon.discountValue} OFF`}
                </span>
              </p>
              <p className="text-gray-600 text-sm">{selectedCoupon.title}</p>
              <p className="text-gray-500 text-xs mt-1">
                Code: {selectedCoupon.code}
              </p>
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="w-full p-4 bg-blue-50 rounded-lg mb-6 text-sm">
          <p className="text-blue-800 mb-2">
            <span className="font-bold">Important: </span>A confirmation email
            has been sent to your registered email address.
          </p>
          <p className="text-blue-800">
            Please arrive 10 minutes before your appointment time.
          </p>
        </div>

        {/* 새 예약 버튼 */}
        <button
          onClick={handleNewBooking}
          className="w-full bg-black text-white font-bold py-3 rounded-md"
        >
          Book Another Appointment
        </button>
      </div>
    </div>
  );
};

export default BookingComplete;
