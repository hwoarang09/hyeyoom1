import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  contentClassName?: string; // 추가: 모달 컨텐츠에 적용할 추가 클래스
  bgColor?: string; // 추가: 모달 배경색 커스터마이징
  textColor?: string; // 추가: 모달 텍스트 색상 커스터마이징
}

// 모달 컴포넌트 - 새로운 구조로 재설계
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  contentClassName = "",
  bgColor = "bg-white", // 기본값은 흰색 배경
  textColor = "text-gray-700", // 기본값은 회색 텍스트
}) => {
  // 히스토리 상태 추가 여부를 추적하는 ref
  const historyStateAdded = useRef(false);

  // 스크롤 위치를 저장하기 위한 ref
  const scrollYRef = useRef(0);

  // 브라우저 뒤로가기 버튼 처리
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 history에 상태 추가 (중복 추가 방지)
      if (!historyStateAdded.current) {
        window.history.pushState({ modal: true }, "");
        historyStateAdded.current = true;
      }

      // 뒤로가기 이벤트 리스너 추가
      const handlePopState = () => {
        onClose();
        historyStateAdded.current = false;
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    } else {
      // 모달이 닫힐 때 히스토리 상태 추가 여부 초기화
      historyStateAdded.current = false;
    }
  }, [isOpen, onClose]);

  // ESC 키를 누르면 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 모달이 열리고 닫힐 때 스크롤 처리 - 매우 단순화된 방식
  useEffect(() => {
    // 모달이 열릴 때
    if (isOpen) {
      // 현재 스크롤 위치 저장
      scrollYRef.current = window.scrollY;

      // 배경 스크롤 비활성화 (가장 간단한 방식)
      document.body.style.overflow = "hidden";

      // 모달 내부 스크롤을 맨 위로 이동
      setTimeout(() => {
        const modalContent = document.querySelector(".modal-content");
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      }, 10);
    }
    // 모달이 닫힐 때
    else if (scrollYRef.current > 0) {
      // 스크롤 활성화
      document.body.style.overflow = "";

      // 스크롤 위치 복원
      window.scrollTo(0, scrollYRef.current);
    }

    // 컴포넌트 언마운트 시
    return () => {
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "";

        if (scrollYRef.current > 0) {
          window.scrollTo(0, scrollYRef.current);
        }
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}></div>

      {/* 모달 전체 컨테이너 - 고정 레이아웃 */}
      <div className={`fixed inset-0 z-50 flex flex-col ${bgColor}`}>
        {/* 모달 헤더 - 고정 영역 (높이만 줄임) */}
        <div className={`flex-none ${bgColor} border-b`}>
          <div className="flex justify-between items-center px-4 py-2">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className={`mr-3 ${
                  bgColor === "bg-black"
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                } p-1.5 rounded cursor-pointer transition-colors duration-200`}
                aria-label="Back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              <h3
                className={`text-lg font-semibold ${
                  bgColor === "bg-black" ? "text-white" : textColor
                }`}
              >
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`${
                bgColor === "bg-black"
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              } p-1.5 rounded cursor-pointer transition-colors duration-200`}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 모달 메인 - 스크롤 가능 영역 */}
        <div
          className={`flex-grow overflow-y-auto modal-content ${contentClassName}`}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
