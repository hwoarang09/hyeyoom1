import React, { useEffect, useRef, useLayoutEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// 모달 컴포넌트 - 새로운 구조로 재설계
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
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

  // 모달이 열릴 때 스크롤 위치 저장 및 배경 스크롤 비활성화
  useLayoutEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      scrollYRef.current = scrollY;

      // 배경 스크롤 비활성화 (iOS Safari에서도 작동하는 방식)
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // 모달 내부 스크롤을 맨 위로 이동
      setTimeout(() => {
        const modalContent = document.querySelector(".modal-content");
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      }, 10);
    }

    return () => {
      // 모달이 닫힐 때만 실행 (언마운트 시)
      if (isOpen && scrollYRef.current > 0) {
        // 스타일 복원
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        // 스크롤 복원
        window.scrollTo(0, scrollYRef.current);
      }
    };
  }, [isOpen]);

  // 모달이 닫힐 때 스크롤 위치 복원
  useEffect(() => {
    if (!isOpen && scrollYRef.current > 0) {
      // 스타일 복원
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      // 스크롤 복원
      const scrollY = scrollYRef.current;
      setTimeout(() => {
        window.scrollTo(0, scrollY);
      }, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}></div>

      {/* 모달 전체 컨테이너 - 고정 레이아웃 */}
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        {/* 모달 헤더 - 고정 영역 */}
        <div className="flex-none bg-white border-b">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="mr-3 text-gray-500 hover:text-gray-700"
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
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 모달 메인 - 스크롤 가능 영역 */}
        <div className="flex-grow overflow-y-auto modal-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
