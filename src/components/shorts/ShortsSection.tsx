import React, { useRef, useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import ShortsModal from "@/components/shorts/ShortsModal";
import { useUIStore } from "@/store/uiStore";

// 비디오 썸네일 캡처 함수 타입
type VideoThumbnailCaptureFunction = (
  videoUrl: string,
  callback: (thumbnailUrl: string) => void
) => void;

// 비디오 썸네일 캡처 함수
const captureVideoThumbnail: VideoThumbnailCaptureFunction = (
  videoUrl,
  callback
) => {
  // 비디오 요소 생성
  const video = document.createElement("video");
  video.crossOrigin = "anonymous"; // CORS 이슈 방지
  video.src = videoUrl;
  video.muted = true;
  video.preload = "metadata";

  // 비디오 로드 이벤트 핸들러
  video.onloadeddata = () => {
    // 비디오의 첫 프레임으로 이동
    video.currentTime = 0.1; // 0.1초로 설정하여 첫 프레임 캡처
  };

  // 시간 업데이트 이벤트 핸들러
  video.onseeked = () => {
    // 캔버스 생성
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 비디오 프레임을 캔버스에 그리기
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 캔버스 이미지를 데이터 URL로 변환
      const thumbnailUrl = canvas.toDataURL("image/jpeg");

      // 콜백 함수 호출
      callback(thumbnailUrl);
    }

    // 메모리 정리
    video.pause();
    video.src = "";
    video.load();
  };

  // 에러 핸들러
  video.onerror = () => {
    console.error("Error loading video:", videoUrl);
    // 에러 발생 시 기본 썸네일 사용
    callback("");
  };

  // 비디오 로드 시작
  video.load();
};

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
  }, [displayedShorts]);

  // 모달 상태 변경 핸들러
  const handleModalToggle = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    setModalOpen(isOpen);
  };

  // 비디오 모달 열기
  const openVideoModal = (index: number) => {
    setSelectedVideoIndex(index);
    setCurrentShortsIndex(index);
    setIsVideoModalOpen(true);
    setModalOpen(true);
  };

  // 비디오 모달 닫기
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setModalOpen(false);
  };

  // 비디오 변경 핸들러
  const handleChangeVideo = (index: number) => {
    setCurrentShortsIndex(index);
    setSelectedVideoIndex(index);
  };

  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-4">Shorts</h2>

      <div
        className="flex overflow-x-auto scrollbar-hide gap-3 pb-2"
        ref={scrollContainerRef}
      >
        {displayedShorts.map((short, index) => (
          <div
            key={short.id}
            className="flex-shrink-0 w-28 cursor-pointer"
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
      <ShortsModal
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
