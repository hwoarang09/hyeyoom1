import React, { useRef, useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import ShortsModal from "@/components/shorts/ShortsModal";
import { useUIStore } from "@/store/uiStore";

interface Short {
  id: string;
  thumbnail: string;
  title: string;
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
    // 비디오 URL 배열 생성 - customer_1~4 파일 사용
    const videos = [
      "/reels/customer/customer_1.mp4",
      "/reels/customer/customer_2.mp4",
      "/reels/customer/customer_3.mp4",
      "/reels/customer/customer_4.mp4",
      ...Array.from(
        { length: Math.max(0, displayedShorts.length - 4) },
        (_, i) => `/reels/shorts/short_${i + 1}.mp4`
      ),
    ];
    setShortsVideos(videos);
  }, [displayedShorts.length]);

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
        videoUrl={
          selectedVideoIndex === 0
            ? "/reels/customer/customer_1.mp4"
            : selectedVideoIndex === 1
            ? "/reels/customer/customer_2.mp4"
            : selectedVideoIndex === 2
            ? "/reels/customer/customer_3.mp4"
            : selectedVideoIndex === 3
            ? "/reels/customer/customer_4.mp4"
            : `/reels/shorts/short_${selectedVideoIndex - 3}.mp4`
        }
        title={
          selectedVideoIndex === 0
            ? "빈티지펌 스타일"
            : selectedVideoIndex === 1
            ? "볼륨 매직 스타일"
            : selectedVideoIndex === 2
            ? "레이어드 컷 스타일"
            : selectedVideoIndex === 3
            ? "발레아쥬 염색 스타일"
            : displayedShorts[selectedVideoIndex]?.title || "Short Video"
        }
        description={
          selectedVideoIndex === 0
            ? "반년전에 젤리펌 시술받으시고 커트만으로 빈티지펌 스타일 해드렸어요✨\n모발이 얇으신분\n볼륨이 부족하신분\n머리손질이 힘드신분들께 추천드려요!"
            : selectedVideoIndex === 1
            ? "볼륨 매직으로 자연스러운 스타일링이 가능해요\n곱슬거림이 있으신 분\n모발이 부스스하신 분\n스타일링이 어려우신 분께 추천드려요!"
            : selectedVideoIndex === 2
            ? "레이어드 컷으로 가벼운 느낌과 볼륨감을 동시에 살렸어요\n머리가 무거우신 분\n층이 필요하신 분\n스타일링이 쉬운 머리를 원하시는 분께 추천드려요!"
            : selectedVideoIndex === 3
            ? "발레아쥬 염색으로 자연스러운 그라데이션 효과를 연출했어요\n밝은 컬러를 원하시는 분\n자연스러운 그라데이션을 원하시는 분\n트렌디한 스타일을 원하시는 분께 추천드려요!"
            : "다양한 헤어스타일과 시술 과정을 확인해보세요."
        }
        author={selectedVideoIndex <= 3 ? "@hae.yoonhoon" : "@haeyoom_salon"}
        hashtags={
          selectedVideoIndex === 0
            ? [
                "sydneyhair",
                "sydneykoreanhairsalon",
                "sydneyhairdresser",
                "sydneyhairsalon",
                "sydneyhairstylist",
                "시드니미용실",
                "시드니한인미용실",
                "시드니젤리펌",
                "시드니빈티지펌",
                "시드니히피펌",
              ]
            : selectedVideoIndex === 1
            ? [
                "sydneyhair",
                "sydneykoreanhairsalon",
                "sydneyhairdresser",
                "sydneyhairsalon",
                "sydneyhairstylist",
                "시드니미용실",
                "시드니한인미용실",
                "시드니볼륨매직",
                "시드니매직",
              ]
            : selectedVideoIndex === 2
            ? [
                "sydneyhair",
                "sydneykoreanhairsalon",
                "sydneyhairdresser",
                "sydneyhairsalon",
                "sydneyhairstylist",
                "시드니미용실",
                "시드니한인미용실",
                "시드니레이어드컷",
                "시드니헤어컷",
              ]
            : selectedVideoIndex === 3
            ? [
                "sydneyhair",
                "sydneykoreanhairsalon",
                "sydneyhairdresser",
                "sydneyhairsalon",
                "sydneyhairstylist",
                "시드니미용실",
                "시드니한인미용실",
                "시드니발레아쥬",
                "시드니염색",
              ]
            : ["sydneyhair", "haeyoom", "hairstyle"]
        }
        daysAgo={
          selectedVideoIndex === 0
            ? 4
            : selectedVideoIndex === 1
            ? 2
            : selectedVideoIndex === 2
            ? 5
            : selectedVideoIndex === 3
            ? 1
            : 7
        }
        videos={shortsVideos}
        titles={[
          "빈티지펌 스타일",
          "볼륨 매직 스타일",
          "레이어드 컷 스타일",
          "발레아쥬 염색 스타일",
          ...displayedShorts.slice(4).map((s) => s.title || "Short Video"),
        ]}
        descriptions={[
          "반년전에 젤리펌 시술받으시고 커트만으로 빈티지펌 스타일 해드렸어요✨\n모발이 얇으신분\n볼륨이 부족하신분\n머리손질이 힘드신분들께 추천드려요!",
          "볼륨 매직으로 자연스러운 스타일링이 가능해요\n곱슬거림이 있으신 분\n모발이 부스스하신 분\n스타일링이 어려우신 분께 추천드려요!",
          "레이어드 컷으로 가벼운 느낌과 볼륨감을 동시에 살렸어요\n머리가 무거우신 분\n층이 필요하신 분\n스타일링이 쉬운 머리를 원하시는 분께 추천드려요!",
          "발레아쥬 염색으로 자연스러운 그라데이션 효과를 연출했어요\n밝은 컬러를 원하시는 분\n자연스러운 그라데이션을 원하시는 분\n트렌디한 스타일을 원하시는 분께 추천드려요!",
          ...Array(Math.max(0, displayedShorts.length - 4)).fill(
            "다양한 헤어스타일과 시술 과정을 확인해보세요."
          ),
        ]}
        authors={[
          "@hae.yoonhoon",
          "@hae.yoonhoon",
          "@hae.yoonhoon",
          "@hae.yoonhoon",
          ...Array(Math.max(0, displayedShorts.length - 4)).fill(
            "@haeyoom_salon"
          ),
        ]}
        hashtagsList={[
          [
            "sydneyhair",
            "sydneykoreanhairsalon",
            "sydneyhairdresser",
            "sydneyhairsalon",
            "sydneyhairstylist",
            "시드니미용실",
            "시드니한인미용실",
            "시드니젤리펌",
            "시드니빈티지펌",
            "시드니히피펌",
          ],
          [
            "sydneyhair",
            "sydneykoreanhairsalon",
            "sydneyhairdresser",
            "sydneyhairsalon",
            "sydneyhairstylist",
            "시드니미용실",
            "시드니한인미용실",
            "시드니볼륨매직",
            "시드니매직",
          ],
          [
            "sydneyhair",
            "sydneykoreanhairsalon",
            "sydneyhairdresser",
            "sydneyhairsalon",
            "sydneyhairstylist",
            "시드니미용실",
            "시드니한인미용실",
            "시드니레이어드컷",
            "시드니헤어컷",
          ],
          [
            "sydneyhair",
            "sydneykoreanhairsalon",
            "sydneyhairdresser",
            "sydneyhairsalon",
            "sydneyhairstylist",
            "시드니미용실",
            "시드니한인미용실",
            "시드니발레아쥬",
            "시드니염색",
          ],
          ...Array(Math.max(0, displayedShorts.length - 4)).fill([
            "sydneyhair",
            "haeyoom",
            "hairstyle",
          ]),
        ]}
        daysAgoList={[
          4,
          2,
          5,
          1,
          ...Array(Math.max(0, displayedShorts.length - 4)).fill(7),
        ]}
        onChangeVideo={handleChangeVideo}
        currentIndex={currentShortsIndex}
      />
    </div>
  );
};

export default ShortsSection;
