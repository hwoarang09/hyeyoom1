import React, { useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
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

  // Zustand 스토어에서 모달 상태 설정 함수 가져오기
  const setModalOpen = useUIStore((state) => state.setModalOpen);

  // 모달 상태 변경 핸들러
  const handleModalToggle = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    setModalOpen(isOpen);
  };

  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-4">Shorts</h2>

      <div
        className="flex overflow-x-auto scrollbar-hide gap-3 pb-2"
        ref={scrollContainerRef}
      >
        {displayedShorts.map((short) => (
          <div key={short.id} className="flex-shrink-0 w-28">
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
    </div>
  );
};

export default ShortsSection;
