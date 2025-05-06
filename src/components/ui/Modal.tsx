import React, { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Zustand 스토어에서 스크롤 위치 관련 함수 가져오기
  const saveScrollPosition = useUIStore((state) => state.saveScrollPosition);
  const previousScrollPosition = useUIStore(
    (state) => state.previousScrollPosition
  );

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

  // 모달이 열리면 스크롤 위치 저장 및 배경 스크롤 비활성화, 닫히면 이전 위치로 복원
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const currentScrollPosition = window.scrollY;
      saveScrollPosition(currentScrollPosition);

      // 배경 스크롤 완전히 비활성화 (iOS Safari 포함 모든 브라우저에서 작동하는 방식)
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${currentScrollPosition}px`;

      // 모달 내부 스크롤을 맨 위로 이동 (setTimeout으로 지연 실행)
      setTimeout(() => {
        const modalContainer = document.querySelector(".modal-container");
        if (modalContainer) {
          modalContainer.scrollTop = 0;
        }
      }, 10);
    } else {
      // 모달이 닫히면 이전 스크롤 위치로 복원
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";

      // 이전 스크롤 위치로 복원
      window.scrollTo(0, previousScrollPosition);
    }

    // 컴포넌트 언마운트 시 원래 스크롤 상태로 복원
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isOpen, saveScrollPosition, previousScrollPosition]);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}></div>

      {/* 모달 컨테이너 */}
      <div
        className="fixed inset-0 z-50 bg-white modal-container"
        style={{ width: "100%", height: "100%", overflowY: "auto" }}
      >
        {/* 모달 헤더 - 상단에 고정 */}
        <div className="sticky top-0 left-0 right-0 z-10 bg-white">
          <div className="flex justify-between items-center p-4 border-b">
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

        {/* 모달 내용 */}
        <div className="w-full">{children}</div>
      </div>
    </>
  );
};

export default Modal;
