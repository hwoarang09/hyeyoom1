import React, { useRef, useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import ShortsModalNew from "@/components/shorts/ShortsModalNew";
import { useUIStore } from "@/store/uiStore";

// 비디오 썸네일 캡처 함수 타입 (주석 처리)
// type VideoThumbnailCaptureFunction = (
//   videoUrl: string,
//   callback: (thumbnailUrl: string) => void
// ) => void;

interface Short {
  id: string;
  thumbnail: string;
  videoUrl: string;
  title: string;
  description?: string;
  author?: string;
  hashtags?: string[];
  daysAgo?: number;
  views: number;
}

interface ShortsSectionProps {
  shorts: Short[];
}

const ShortsSection: React.FC<ShortsSectionProps> = ({ shorts }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 스크롤 버튼 핸들러
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  // 최대 10개의 쇼츠만 표시
  const displayedShorts = shorts.slice(0, 10);
  const hasMoreShorts = shorts.length > 10;

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [currentShortsIndex, setCurrentShortsIndex] = useState(0);
  const [shortsVideos, setShortsVideos] = useState<string[]>([]);

  // Zustand 스토어에서 모달 상태 설정 함수 가져오기
  const setModalOpen = useUIStore((state) => state.setModalOpen);

  // 쇼츠 비디오 URL 설정
  useEffect(() => {
    // 비디오 URL 배열 생성 - 각 쇼츠의 videoUrl 속성 사용
    const videos = displayedShorts.map((short) => short.videoUrl);
    setShortsVideos(videos);
  }, [shorts]); // displayedShorts는 shorts에서 파생되므로 shorts를 의존성으로 사용

  // 모달 상태 변경 핸들러
  const handleModalToggle = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    setModalOpen(isOpen);
  };

  // 비디오 모달 열기
  const openVideoModal = (index: number) => {
    console.log(`Opening video modal with index: ${index}`);

    // 상태 업데이트를 일괄 처리하여 불필요한 렌더링 방지
    setSelectedVideoIndex(index);
    setCurrentShortsIndex(index);

    // 모달 상태 업데이트
    setIsVideoModalOpen(true);
    setModalOpen(true);
  };

  // 비디오 모달 닫기 - 단순화된 버전
  const closeVideoModal = () => {
    // 모달 상태 업데이트
    setIsVideoModalOpen(false);
    setModalOpen(false);

    // 모든 비디오 요소를 찾아서 강제로 정지시킴 (소리가 계속 나오는 문제 해결)
    try {
      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((video) => {
        video.pause();
        video.volume = 0;
        video.currentTime = 0;
      });
    } catch (error) {
      console.error("Error stopping videos:", error);
    }
  };

  // 비디오 변경 핸들러
  const handleChangeVideo = (index: number) => {
    // 현재 인덱스와 다를 때만 상태 업데이트 (불필요한 렌더링 방지)
    if (currentShortsIndex !== index || selectedVideoIndex !== index) {
      console.log(
        `handleChangeVideo: Updating indices from ${currentShortsIndex} to ${index}`
      );
      setCurrentShortsIndex(index);
      setSelectedVideoIndex(index);
    }
  };

  // 디버깅을 위한 useEffect
  useEffect(() => {
    if (isVideoModalOpen) {
      console.log(
        `ShortsSection: Video modal opened with currentShortsIndex: ${currentShortsIndex}`
      );
    }
  }, [isVideoModalOpen, currentShortsIndex]);

  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shorts</h2>

        {/* 스크롤 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleScrollLeft}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={handleScrollRight}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className="flex overflow-x-auto gap-3 pb-4 pt-1 px-1 snap-x snap-mandatory touch-pan-x"
          style={{
            scrollbarWidth: "none", // Firefox
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none", // IE and Edge
          }}
          ref={scrollContainerRef}
        >
          {displayedShorts.map((short, index) => (
            <div
              key={short.id}
              className="flex-shrink-0 w-28 cursor-pointer snap-start"
              onClick={() => openVideoModal(index)}
            >
              <div className="relative aspect-[9/16] rounded-lg overflow-hidden mb-1">
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {short.views >= 1000
                    ? `${(short.views / 1000).toFixed(1)}K`
                    : short.views}
                </div>
                {/* 재생 아이콘 추가 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-black/30 rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
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
                  </div>
                </div>
              </div>
              <h3 className="text-xs font-medium truncate">{short.title}</h3>
            </div>
          ))}
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 py-1">
          {displayedShorts.length > 3 && (
            <div className="h-1 bg-gray-200 rounded-full w-20">
              <div
                className="h-1 bg-gray-400 rounded-full"
                style={{ width: "30%" }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* See all 버튼을 하단에 배치 */}
      {hasMoreShorts && (
        <div className="mt-4 text-center">
          <button
            onClick={() => handleModalToggle(true)}
            className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            See all
          </button>
        </div>
      )}

      {/* 쇼츠 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => handleModalToggle(false)}
        title="All Shorts"
      >
        <div className="px-4 py-4 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {shorts.map((short) => (
              <div key={short.id} className="flex flex-col">
                <div className="relative aspect-[9/16] rounded-lg overflow-hidden mb-1">
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {short.views >= 1000
                      ? `${(short.views / 1000).toFixed(1)}K`
                      : short.views}
                  </div>
                </div>
                <h3 className="text-xs font-medium truncate">{short.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* 비디오 모달 */}
      {/* 디버깅 로그는 useEffect 내에서 처리 */}

      <ShortsModalNew
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        videoUrl={shortsVideos[selectedVideoIndex] || ""}
        title={displayedShorts[selectedVideoIndex]?.title || "Short Video"}
        description={
          displayedShorts[selectedVideoIndex]?.description ||
          "다양한 헤어스타일과 시술 과정을 확인해보세요."
        }
        author={displayedShorts[selectedVideoIndex]?.author || "@haeyoom_salon"}
        hashtags={
          displayedShorts[selectedVideoIndex]?.hashtags || [
            "sydneyhair",
            "haeyoom",
            "hairstyle",
          ]
        }
        daysAgo={displayedShorts[selectedVideoIndex]?.daysAgo || 7}
        videos={shortsVideos}
        titles={displayedShorts.map((short) => short.title)}
        descriptions={displayedShorts.map(
          (short) =>
            short.description || "다양한 헤어스타일과 시술 과정을 확인해보세요."
        )}
        authors={displayedShorts.map(
          (short) => short.author || "@haeyoom_salon"
        )}
        hashtagsList={displayedShorts.map(
          (short) => short.hashtags || ["sydneyhair", "haeyoom", "hairstyle"]
        )}
        daysAgoList={displayedShorts.map((short) => short.daysAgo || 7)}
        onChangeVideo={handleChangeVideo}
        currentIndex={currentShortsIndex}
      />
    </div>
  );
};

export default ShortsSection;
