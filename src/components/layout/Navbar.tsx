import React, { useState, useEffect, useRef } from "react";

const Navbar: React.FC = () => {
  // 현재 선택된 탭
  const [activeTab, setActiveTab] = useState<string>("Services");
  // 헤더 표시 여부
  const [showHeader, setShowHeader] = useState<boolean>(false);
  // Photos 섹션 참조
  const photosRef = useRef<HTMLElement | null>(null);

  // 탭 메뉴 항목
  const tabs = ["Photos", "Services", "Team", "Reviews", "Buy", "About"];

  // 탭 클릭 핸들러
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    // 해당 섹션으로 스크롤
    const sectionId = `${tab.toLowerCase()}-section`;
    const section = document.getElementById(sectionId);

    if (section) {
      // 네비게이션 바 높이를 고려하여 스크롤 위치 조정
      const navbarHeight = 100; // 대략적인 네비게이션 바 높이
      const sectionTop =
        section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    }
  };

  // Photos 섹션 참조 가져오기
  useEffect(() => {
    photosRef.current = document.getElementById("photos-section");
  }, []);

  // 스크롤 이벤트에 따라 활성 탭 업데이트 및 헤더 표시 여부 결정
  useEffect(() => {
    const handleScroll = () => {
      // 현재 스크롤 위치
      const scrollPosition = window.scrollY;

      // Photos 섹션 아래로 스크롤했을 때만 헤더 표시
      if (photosRef.current) {
        const photosSection = photosRef.current;
        const photosSectionBottom =
          photosSection.offsetTop + photosSection.offsetHeight;
        // Photos 섹션을 지나서 스크롤했을 때만 헤더 표시
        setShowHeader(scrollPosition >= photosSectionBottom - 50); // 50px 정도 여유를 두고 헤더 표시
      }

      // 탭 선택을 위한 스크롤 위치 (네비게이션 바 높이 고려)
      const scrollPositionForTabs = scrollPosition + 120;

      // 각 섹션의 위치 확인
      const sections = tabs.map((tab) => {
        const sectionId = `${tab.toLowerCase()}-section`;
        const section = document.getElementById(sectionId);
        if (!section) return { id: tab, position: 0 };

        return {
          id: tab,
          position: section.offsetTop,
        };
      });

      // 현재 스크롤 위치에 해당하는 섹션 찾기
      // 섹션을 역순으로 정렬하여 가장 가까운 섹션 찾기
      const sortedSections = [...sections].sort(
        (a, b) => b.position - a.position
      );
      const currentSection = sortedSections.find(
        (section) => section.position <= scrollPositionForTabs
      );

      if (currentSection && currentSection.id !== activeTab) {
        setActiveTab(currentSection.id);
      } else if (
        !currentSection &&
        scrollPositionForTabs < sections[0]?.position
      ) {
        // 가장 상단에 있는 경우 첫 번째 탭 선택
        setActiveTab(tabs[0]);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 초기 스크롤 위치에 따라 탭 설정
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tabs, activeTab]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ${
        !showHeader ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* 상단 헤더 - 가게 이름과 액션 버튼 */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="font-semibold text-base truncate">
            HAEYOOM | Sydney Hair Salon
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Share"
            onClick={() => {
              // 현재 URL을 클립보드에 복사
              navigator.clipboard.writeText(window.location.href);
              // 실제 구현에서는 복사 성공 알림을 표시할 수 있음
              alert("URL copied to clipboard!");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Z"
              />
            </svg>
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Login"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex px-4 space-x-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-3 font-medium text-sm relative ${
                activeTab === tab ? "text-black" : "text-gray-500"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
