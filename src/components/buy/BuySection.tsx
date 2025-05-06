import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/store/uiStore";

interface BuyOption {
  id: string;
  title: string;
  description: string;
}

interface BuySectionProps {
  options: BuyOption[];
}

const BuySection: React.FC<BuySectionProps> = ({ options }) => {
  // 최대 3개의 옵션만 표시
  const displayedOptions = options.slice(0, 3);
  const hasMoreOptions = options.length > 3;

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
      <h2 className="text-xl font-bold mb-4">Buy</h2>

      <div className="space-y-4">
        {displayedOptions.map((option) => (
          <div key={option.id} className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{option.title}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
            <button className="bg-white border border-gray-300 text-gray-800 rounded-full px-4 py-1 text-sm hover:bg-gray-50">
              Buy
            </button>
          </div>
        ))}
      </div>

      {/* See all 버튼을 하단에 배치 */}
      {hasMoreOptions && (
        <div className="mt-4 text-center">
          <button
            onClick={() => handleModalToggle(true)}
            className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            See all
          </button>
        </div>
      )}

      {/* 구매 옵션 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => handleModalToggle(false)}
        title="All Purchase Options"
      >
        <div className="px-4 py-4 space-y-4 w-full">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <button className="bg-white border border-gray-300 text-gray-800 rounded-full px-4 py-1 text-sm hover:bg-gray-50">
                Buy
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default BuySection;
