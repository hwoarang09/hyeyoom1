import React, { useState } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { useCouponStore } from "@/store/couponStore";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, X } from "lucide-react";

// 예약 확인 컴포넌트
const BookingConfirmation: React.FC = () => {
  // 예약 상태 스토어에서 필요한 상태 가져오기
  const { selectedServices, selectedDate, selectedTime, setStep } =
    useBookingStore();

  // 쿠폰 스토어에서 필요한 상태와 액션 가져오기
  const { getValidCoupons, selectedCouponId, selectCoupon, getCouponById } =
    useCouponStore();

  // 쿠폰 선택 UI 상태
  const [showCouponSelector, setShowCouponSelector] = useState(false);

  // 유효한 쿠폰 목록
  const validCoupons = getValidCoupons();

  // 선택된 쿠폰
  const selectedCoupon = selectedCouponId
    ? getCouponById(selectedCouponId)
    : null;

  // 총 가격 계산 (예시: 실제로는 서비스 가격을 숫자로 변환하여 계산해야 함)
  const subtotalPrice = selectedServices
    .map((service) => {
      // 가격 문자열에서 숫자만 추출 (예: "SGD 56" -> 56)
      const priceMatch = service.price.match(/\d+/);
      return priceMatch ? parseInt(priceMatch[0], 10) : 0;
    })
    .reduce((sum, price) => sum + price, 0);

  // 할인 금액 계산
  const calculateDiscount = () => {
    if (!selectedCoupon) return 0;

    if (selectedCoupon.discountType === "percentage") {
      // 퍼센트 할인
      const discount = (subtotalPrice * selectedCoupon.discountValue) / 100;

      // 최대 할인 금액이 있는 경우 적용
      if (
        selectedCoupon.maxDiscountAmount &&
        discount > selectedCoupon.maxDiscountAmount
      ) {
        return selectedCoupon.maxDiscountAmount;
      }

      return discount;
    } else {
      // 고정 금액 할인
      return Math.min(selectedCoupon.discountValue, subtotalPrice);
    }
  };

  // 할인 금액
  const discountAmount = selectedCoupon ? calculateDiscount() : 0;

  // 최종 가격
  const totalPrice = subtotalPrice - discountAmount;

  // 총 소요 시간 계산 (예시: 실제로는 서비스 시간을 분으로 변환하여 계산해야 함)
  const totalDuration = selectedServices
    .map((service) => {
      // 시간 문자열에서 숫자와 단위 추출 (예: "45 mins" -> 45, "1 hr" -> 60)
      const durationMatch = service.duration.match(/(\d+)\s*(mins|hr)/);
      if (durationMatch) {
        const value = parseInt(durationMatch[1], 10);
        const unit = durationMatch[2];
        return unit === "hr" ? value * 60 : value;
      }
      return 0;
    })
    .reduce((sum, duration) => sum + duration, 0);

  // 시간을 시간:분 형식으로 변환
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours} hr${hours > 1 ? "s" : ""} ${mins > 0 ? `${mins} mins` : ""}`
      : `${mins} mins`;
  };

  return (
    <div className="px-4 py-5">
      <h2 className="text-xl font-bold mb-4">Confirm Your Booking</h2>

      {/* 선택한 서비스 목록 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Selected Services</h3>
        <div className="space-y-3">
          {selectedServices.map((service) => (
            <div
              key={service.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-gray-600">{service.duration}</p>
              </div>
              <p className="font-medium">{service.price}</p>
            </div>
          ))}
        </div>

        {/* 쿠폰 선택 영역 */}
        {validCoupons.length > 0 && (
          <div className="mt-4 mb-2">
            <button
              onClick={() => setShowCouponSelector(!showCouponSelector)}
              className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-lg text-left"
            >
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {selectedCoupon ? "Coupon Applied" : "Apply Coupon"}
                </span>
                {selectedCoupon && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {selectedCoupon.discountType === "percentage"
                      ? `${selectedCoupon.discountValue}% OFF`
                      : `SGD ${selectedCoupon.discountValue} OFF`}
                  </span>
                )}
              </div>
              {showCouponSelector ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {/* 쿠폰 목록 */}
            {showCouponSelector && (
              <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                {validCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`p-3 border-b border-gray-200 last:border-b-0 flex items-center justify-between ${
                      selectedCouponId === coupon.id ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{coupon.title}</p>
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% OFF`
                            : `SGD ${coupon.discountValue} OFF`}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Expires:{" "}
                        {format(new Date(coupon.expiryDate), "MMM d, yyyy")}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedCouponId === coupon.id) {
                          selectCoupon(null);
                        } else {
                          selectCoupon(coupon.id);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedCouponId === coupon.id
                          ? "bg-gray-200 text-gray-800"
                          : "bg-black text-white"
                      }`}
                    >
                      {selectedCouponId === coupon.id ? "Remove" : "Apply"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 총 가격 및 소요 시간 */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          {/* 소계 */}
          <div className="flex justify-between items-center mb-1">
            <p className="text-gray-600">Subtotal:</p>
            <p>SGD {subtotalPrice}</p>
          </div>

          {/* 할인 금액 (쿠폰이 적용된 경우에만 표시) */}
          {selectedCoupon && (
            <div className="flex justify-between items-center mb-1 text-green-600">
              <div className="flex items-center">
                <p>Discount:</p>
                <span className="ml-1 text-xs">({selectedCoupon.code})</span>
              </div>
              <p>-SGD {discountAmount.toFixed(2)}</p>
            </div>
          )}

          {/* 구분선 */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* 최종 가격 */}
          <div className="flex justify-between items-center mb-1">
            <p className="font-medium">Total Price:</p>
            <p className="font-bold">SGD {totalPrice.toFixed(2)}</p>
          </div>

          {/* 총 소요 시간 */}
          <div className="flex justify-between items-center">
            <p className="font-medium">Total Duration:</p>
            <p>{formatDuration(totalDuration)}</p>
          </div>
        </div>
      </div>

      {/* 예약 날짜 및 시간 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Date & Time</h3>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="font-medium">
            {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
          <p className="text-gray-600">{selectedTime}</p>
        </div>
      </div>

      {/* 예약자 정보 (실제 구현 시 사용자 입력 필드 추가) */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Your Information</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">Name: John Doe</p>
            <p className="text-gray-600">Phone: +1 234 567 8900</p>
            <p className="text-gray-600">Email: john.doe@example.com</p>
          </div>
        </div>
      </div>

      {/* 예약 정책 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Booking Policy</h3>
        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="mb-2">
            • Please arrive 10 minutes before your appointment time.
          </p>
          <p className="mb-2">
            • Cancellations must be made at least 24 hours in advance.
          </p>
          <p>
            • Late arrivals may result in shortened service time or
            rescheduling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
