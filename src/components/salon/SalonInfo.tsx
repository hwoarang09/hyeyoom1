import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import LocationReelsModal from "@/components/location/LocationReelsModal";
import PromotionModal from "@/components/promotion/PromotionModal";
import { locationReels, promotionData } from "@/data/sampleData";
import { useUIStore } from "@/store/uiStore";

interface SalonInfoProps {
  name: string;
  location: string;
  status: "open" | "closed";
  openingTime?: string;
  slogan?: string;
  subtitle?: string;
}

const SalonInfo: React.FC<SalonInfoProps> = ({
  name,
  location,
  status,
  openingTime,
  slogan,
  subtitle,
}) => {
  // 모달 상태
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

  // Zustand 스토어에서 모달 상태 설정 함수 가져오기
  const setModalOpen = useUIStore((state) => state.setModalOpen);

  // Location 모달 상태가 변경될 때 Zustand 스토어 업데이트
  const handleLocationModalToggle = (isOpen: boolean) => {
    setIsLocationModalOpen(isOpen);
    setModalOpen(isOpen);
  };

  // Promotion 모달 상태가 변경될 때 Zustand 스토어 업데이트
  const handlePromotionModalToggle = (isOpen: boolean) => {
    setIsPromotionModalOpen(isOpen);
    setModalOpen(isOpen);
  };
  return (
    <div className="px-4 py-5">
      <h1 className="text-2xl font-bold mb-1">{name}</h1>

      {subtitle && <p className="text-gray-700 font-medium mb-1">{subtitle}</p>}
      {slogan && <p className="text-gray-600 italic mb-2">{slogan}</p>}

      <p className="text-gray-600 mb-2">{location}</p>

      <div className="mb-4">
        <span
          className={`font-medium ${
            status === "open" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status === "open" ? "Open" : "Closed"}
        </span>
        {status === "closed" && openingTime && (
          <span className="text-gray-600"> - opens on {openingTime}</span>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="rounded-full px-4 py-1 h-auto text-sm text-pink-600 border-pink-200 bg-pink-50"
          onClick={() => handlePromotionModalToggle(true)}
        >
          Promotion
        </Button>
        <Button
          variant="outline"
          className="rounded-full px-4 py-1 h-auto text-sm text-blue-600 border-blue-200 bg-blue-50"
          onClick={() => handleLocationModalToggle(true)}
        >
          Location
        </Button>
        <Button
          variant="outline"
          className="rounded-full px-4 py-1 h-auto text-sm text-green-600 border-green-200 bg-green-50"
        >
          Recruit
        </Button>
      </div>

      {/* Location 릴스 모달 */}
      <LocationReelsModal
        isOpen={isLocationModalOpen}
        onClose={() => handleLocationModalToggle(false)}
        reels={locationReels}
      />

      {/* Promotion 모달 */}
      <PromotionModal
        isOpen={isPromotionModalOpen}
        onClose={() => handlePromotionModalToggle(false)}
        slides={promotionData.slides}
        commonMessage={promotionData.commonMessage}
      />
    </div>
  );
};

export default SalonInfo;
