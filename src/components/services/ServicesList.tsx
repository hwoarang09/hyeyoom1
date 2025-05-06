import React, { useState, useRef, useEffect } from "react";
import { sampleServices, sampleServiceCategories } from "@/data/sampleData";

// 서비스 타입 정의
interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  category: string;
  description?: string;
  femaleOnly?: boolean;
}

// 카테고리 타입 정의
interface Category {
  id: string;
  name: string;
}

interface ServicesListProps {
  serviceCount: number;
}

const ServicesList: React.FC<ServicesListProps> = ({ serviceCount }) => {
  // 선택된 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState<string>("featured");

  // 카테고리 스크롤을 위한 ref
  const categoriesRef = useRef<HTMLDivElement>(null);

  // 선택된 카테고리를 중앙으로 스크롤하는 함수
  const scrollToCategory = (categoryId: string) => {
    if (categoriesRef.current) {
      const container = categoriesRef.current;
      const selectedButton = container.querySelector(
        `button[data-category="${categoryId}"]`
      );

      if (selectedButton) {
        // 버튼의 위치와 컨테이너의 중앙 위치 계산
        const buttonRect = selectedButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // 버튼을 중앙에 위치시키기 위한 스크롤 위치 계산
        const scrollLeft =
          selectedButton.offsetLeft -
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

      <p className="text-gray-600 mt-4 text-sm">
        {serviceCount} services available
      </p>
    </div>
  );
};

export default ServicesList;
