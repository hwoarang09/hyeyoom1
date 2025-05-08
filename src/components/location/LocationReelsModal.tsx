import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/store/uiStore";

interface Reel {
  id: string;
  thumbnail: string;
  title: string;
  videoUrl: string;
}

interface LocationReelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reels: Reel[];
}

const LocationReelsModal: React.FC<LocationReelsModalProps> = ({
  isOpen,
  onClose,
  reels,
}) => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Zustand 스토어에서 모달 상태 설정 함수 가져오기
  const setModalOpen = useUIStore((state) => state.setModalOpen);

  // 모달이 열릴 때 첫 번째 릴스부터 시작하도록 설정
  useEffect(() => {
    if (isOpen) {
      setCurrentReelIndex(0);
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [isOpen, setModalOpen]);

  // 자동 재생 기능은 비디오 onEnded 이벤트로 대체
  // 자동 재생 토글 기능은 유지
  useEffect(() => {
    if (!isOpen || !autoPlayEnabled) return;

    // 비디오 요소 참조 (ref 사용)
    const videoElement = videoRef.current;
    if (videoElement) {
      // 자동 재생 활성화 상태일 때는 비디오 재생
      videoElement.play().catch((error) => {
        console.error("Video playback failed:", error);
      });
    }

    return () => {
      // 컴포넌트 언마운트 시 비디오 정지
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [isOpen, currentReelIndex, autoPlayEnabled]);

  // 다음 릴스로 이동
  const goToNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    } else {
      onClose();
    }
  };

  // 이전 릴스로 이동
  const goToPrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  // 자동 재생 토글
  const toggleAutoPlay = () => {
    const newState = !autoPlayEnabled;
    setAutoPlayEnabled(newState);

    // 비디오 요소 참조 (ref 사용)
    const videoElement = videoRef.current;
    if (videoElement) {
      if (newState) {
        // 자동 재생 활성화 시 비디오 재생
        videoElement.play().catch((error) => {
          console.error("Video playback failed:", error);
        });
      } else {
        // 자동 재생 비활성화 시 비디오 정지
        videoElement.pause();
      }
    }
  };

  if (!isOpen || reels.length === 0) return null;

  const currentReel = reels[currentReelIndex];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Location">
      <div className="w-full">
        {/* 릴스 내용 - 상단에 고정 */}
        <div
          className="sticky top-0 z-10 bg-black flex items-center justify-center"
          style={{ height: "80vh" }}
        >
          <div className="relative w-full h-full">
            {/* 비디오 플레이어 */}
            <div className="flex justify-center items-center w-full h-full">
              <video
                src={currentReel.videoUrl}
                poster={currentReel.thumbnail}
                className="w-4/5 h-3/4 object-contain" /* 크기 조정: 너비는 80%, 높이는 75%로 설정 */
                autoPlay
                muted={false}
                controls
                playsInline
                onEnded={goToNextReel}
                key={currentReel.id} // 릴스가 변경될 때 비디오 요소를 다시 렌더링하기 위한 key 추가
                preload="auto"
                controlsList="nodownload"
                ref={(el) => {
                  // 비디오 요소가 마운트되면 볼륨을 50%로 설정
                  if (el) {
                    el.volume = 0.3; // 볼륨을 30%로 설정
                    videoRef.current = el; // 비디오 요소를 ref에 저장
                  }
                }}
              />
            </div>

            {/* 좌우 네비게이션 버튼 */}
            <button
              onClick={goToPrevReel}
              disabled={currentReelIndex === 0}
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full ${
                currentReelIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
              onClick={goToNextReel}
              disabled={currentReelIndex === reels.length - 1}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full ${
                currentReelIndex === reels.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
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

            {/* 진행 상태 표시 */}
            <div className="absolute top-2 left-0 right-0 flex justify-center gap-1 px-4">
              {reels.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    index === currentReelIndex
                      ? "bg-white"
                      : index < currentReelIndex
                      ? "bg-gray-400"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* 자동 재생 토글 버튼 - 비디오 컨트롤이 있으므로 상단으로 이동 */}
            <button
              onClick={toggleAutoPlay}
              className="absolute top-4 right-4 z-10 bg-black/70 text-white p-2 rounded-full"
              aria-label={
                autoPlayEnabled ? "Pause autoplay" : "Enable autoplay"
              }
            >
              {autoPlayEnabled ? (
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
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
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
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          {/* 구분선 추가 */}
          <div className="border-t border-gray-800 mt-2"></div>
        </div>

        {/* 릴스 정보 */}
        <div className="p-4 bg-white">
          <h3 className="text-lg font-semibold">{currentReel.title}</h3>
        </div>
      </div>
    </Modal>
  );
};

export default LocationReelsModal;
