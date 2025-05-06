import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/store/uiStore";

interface PromotionSlide {
  id: string;
  image: string;
  title: string;
}

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: PromotionSlide[];
  commonMessage: string;
}

const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  onClose,
  slides,
  commonMessage,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Zustand 스토어에서 모달 상태 설정 함수 가져오기
  const setModalOpen = useUIStore((state) => state.setModalOpen);

  // 모달이 열리거나 닫힐 때 Zustand 스토어 업데이트
  useEffect(() => {
    if (isOpen) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [isOpen, setModalOpen]);

  // 슬라이드 자동 전환을 위한 타이머
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 슬라이드 기능
  useEffect(() => {
    if (isOpen) {
      startAutoSlide();
    }
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [isOpen]);

  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      nextSlide();
    }, 5000); // 5초마다 슬라이드 변경
  };

  const resetAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    startAutoSlide();
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    resetAutoSlide();
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    resetAutoSlide();
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Promotion">
      <div className="w-full pb-10">
        {/* 슬라이드 영역 */}
        <div
          className="relative w-full bg-white mx-auto"
          style={{ maxWidth: "500px", aspectRatio: "1/1" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 슬라이드 이미지 */}
          <div className="relative w-full h-full overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                  index === currentSlideIndex
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error(`Failed to load image: ${slide.image}`);
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x400?text=Image+Not+Found";
                  }}
                />
              </div>
            ))}
          </div>

          {/* 좌우 네비게이션 버튼 */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* 슬라이드 인디케이터 */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlideIndex(index);
                  resetAutoSlide();
                }}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlideIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 공통 메시지 영역 */}
        <div className="p-4 max-w-2xl mx-auto">
          <div className="text-sm text-center mt-2 mb-4 font-medium uppercase tracking-wide">
            SWIPE LEFT TO CHECK OUT OUR HAIRDRESSERS'
            <br />
            MAY DISCOUNT PROMOTIONS
          </div>
          <div className="text-xs text-center mb-6">
            VISIT OUR HAIRDRESSERS' INSTAGRAMS
            <br />
            TO FIND MORE ABOUT THEIR EXCLUSIVE PROMOTIONS!
          </div>
          <div className="whitespace-pre-line text-sm text-gray-700">
            {commonMessage}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PromotionModal;
