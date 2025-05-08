import React, { useState, useRef, useEffect } from "react";
import { sampleServices, sampleServiceCategories } from "@/data/sampleData";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/store/uiStore";

interface ServicesListProps {
  serviceCount: number;
}

const ServicesList: React.FC<ServicesListProps> = ({ serviceCount }) => {
  // 선택된 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState<string>("featured");

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Zustand 스토어에서 모달 상태 설정 함수 가져오기
  const setModalOpen = useUIStore((state) => state.setModalOpen);

  // 모달 상태 변경 핸들러
  const handleModalToggle = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    setModalOpen(isOpen);

    // 모달이 열릴 때 선택된 카테고리를 중앙으로 스크롤
    if (isOpen) {
      setTimeout(() => {
        scrollToCategoryInModal(selectedCategory);
      }, 100);
    }
  };

  // 카테고리 스크롤을 위한 ref
  const categoriesRef = useRef<HTMLDivElement>(null);
  const modalCategoriesRef = useRef<HTMLDivElement>(null);

  // 선택된 카테고리를 중앙으로 스크롤하는 함수 (메인 화면용)
  const scrollToCategory = (categoryId: string) => {
    if (categoriesRef.current) {
      const container = categoriesRef.current;
      const selectedButton = container.querySelector(
        `button[data-category="${categoryId}"]`
      );

      if (selectedButton) {
        // HTMLElement로 타입 캐스팅
        const buttonElement = selectedButton as HTMLElement;

        // 버튼의 위치와 컨테이너의 중앙 위치 계산
        const buttonRect = buttonElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // 버튼을 중앙에 위치시키기 위한 스크롤 위치 계산
        const scrollLeft =
          buttonElement.offsetLeft -
          containerRect.width / 2 +
          buttonRect.width / 2;

        // 부드럽게 스크롤
        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  // 선택된 카테고리를 중앙으로 스크롤하는 함수 (모달용)
  const scrollToCategoryInModal = (categoryId: string) => {
    if (modalCategoriesRef.current) {
      const container = modalCategoriesRef.current;
      const selectedButton = container.querySelector(
        `button[data-category="${categoryId}"]`
      );

      if (selectedButton) {
        // HTMLElement로 타입 캐스팅
        const buttonElement = selectedButton as HTMLElement;

        // 버튼의 위치와 컨테이너의 중앙 위치 계산
        const buttonRect = buttonElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // 버튼을 중앙에 위치시키기 위한 스크롤 위치 계산
        const scrollLeft =
          buttonElement.offsetLeft -
          containerRect.width / 2 +
          buttonRect.width / 2;

        // 부드럽게 스크롤
        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }

      // 해당 카테고리 섹션으로 스크롤
      setTimeout(() => {
        const categorySection = document.getElementById(
          `modal-category-${categoryId}`
        );
        if (categorySection) {
          // 헤더 높이를 고려하여 스크롤 위치 조정 (헤더 높이 + 카테고리 버튼 영역 높이 + 여백)
          const headerHeight = 120;
          const scrollPosition = categorySection.offsetTop - headerHeight;

          // 모달 컨테이너를 찾아서 스크롤
          const modalContainer = document.querySelector(".modal-container");
          if (modalContainer) {
            modalContainer.scrollTo({
              top: scrollPosition,
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  };

  // 컴포넌트 마운트 시 초기 카테고리를 중앙에 위치시키기
  useEffect(() => {
    // 약간의 지연 후 스크롤 적용 (렌더링 후 요소가 완전히 로드되었을 때)
    const timer = setTimeout(() => {
      scrollToCategory(selectedCategory);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 선택된 카테고리에 해당하는 서비스 필터링
  const filteredServices = sampleServices.filter(
    (service) => service.category === selectedCategory
  );

  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-4">Services</h2>

      {/* 카테고리 선택 영역 */}
      <div className="mb-6 overflow-hidden">
        <div
          className="flex overflow-x-auto scrollbar-hide gap-3 py-2 px-1"
          ref={categoriesRef}
        >
          {sampleServiceCategories.map((category) => (
            <button
              key={category.id}
              data-category={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                scrollToCategory(category.id);
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
                selectedCategory === category.id
                  ? "bg-stone-950 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 서비스 목록 */}
      <div className="space-y-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span>{service.duration}</span>
                  {service.femaleOnly && (
                    <>
                      <span>•</span>
                      <span>Female only</span>
                    </>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {service.description}
                  </p>
                )}
                <p className="font-medium mt-2">{service.price}</p>
              </div>
              <button className="bg-white border border-gray-300 text-gray-800 rounded-full px-4 py-1 text-sm hover:bg-gray-50">
                Book
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            No services found in this category
          </p>
        )}
      </div>

      {/* See all 버튼 */}
      <div className="mt-4 text-center">
        <button
          onClick={() => handleModalToggle(true)}
          className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          See all services
        </button>
      </div>

      <p className="text-gray-600 mt-4 text-sm">
        {serviceCount} services available
      </p>

      {/* 서비스 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => handleModalToggle(false)}
        title="All Services"
      >
        <div className="w-full">
          {/* 카테고리 선택 영역 - 고정되지 않음 */}
          <div className="bg-white">
            {/* 카테고리 버튼 영역 */}
            <div className="pt-4 pb-2">
              <div className="overflow-hidden">
                <div
                  className="flex overflow-x-auto scrollbar-hide gap-3 px-4 pb-3"
                  ref={modalCategoriesRef}
                >
                  {sampleServiceCategories.map((category) => (
                    <button
                      key={category.id}
                      data-category={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        scrollToCategoryInModal(category.id);
                      }}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
                        selectedCategory === category.id
                          ? "bg-stone-950 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 mt-2"></div>
            </div>
          </div>

          {/* 서비스 목록 - 스크롤 가능 */}
          <div className="space-y-4 px-4 py-4 pb-20">
            {sampleServiceCategories.map((category) => (
              <div
                key={category.id}
                id={`modal-category-${category.id}`}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold mb-3">{category.name}</h3>
                <div className="space-y-4">
                  {sampleServices
                    .filter((service) => service.category === category.id)
                    .map((service) => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                      >
                        <div>
                          <h3 className="font-semibold text-lg">
                            {service.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <span>{service.duration}</span>
                            {service.femaleOnly && (
                              <>
                                <span>•</span>
                                <span>Female only</span>
                              </>
                            )}
                          </div>
                          {service.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {service.description}
                            </p>
                          )}
                          <p className="font-medium mt-2">{service.price}</p>
                        </div>
                        <button className="bg-white border border-gray-300 text-gray-800 rounded-full px-4 py-1 text-sm hover:bg-gray-50">
                          Book
                        </button>
                      </div>
                    ))}
                </div>
                {category.id !==
                  sampleServiceCategories[sampleServiceCategories.length - 1]
                    .id && (
                  <div className="border-t border-gray-100 mt-6"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServicesList;
