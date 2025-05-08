import Navbar from "./components/layout/Navbar";
import ImageSlider from "./components/photos/ImageSlider";
import SalonInfo from "./components/salon/SalonInfo";
import ServicesList from "./components/services/ServicesList";
import ShortsSection from "./components/shorts/ShortsSection";
import TeamSection from "./components/team/TeamSection";
import ReviewsSection from "./components/reviews/ReviewsSection";
import BuySection from "./components/buy/BuySection";
import AboutSection from "./components/about/AboutSection";
import BookingStatusBar from "./components/layout/BookingStatusBar";
import BookingContainer from "./components/booking/BookingContainer";
import { useUIStore } from "./store/uiStore";
import { useBookingStore } from "./store/bookingStore";
import { Toaster } from "react-hot-toast";

// 샘플 데이터 가져오기
import {
  sampleImages,
  sampleShorts,
  sampleTeam,
  sampleReviews,
  sampleBuyOptions,
  sampleAbout,
} from "./data/sampleData";

function App() {
  // Zustand 스토어에서 모달 상태 가져오기
  const isAnyModalOpen = useUIStore((state) => state.isAnyModalOpen);

  // 예약 상태 스토어에서 현재 단계 가져오기
  const step = useBookingStore((state) => state.step);

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      <Navbar />

      <main className="container mx-auto max-w-7xl pb-16">
        {/* Photos (이미지 슬라이더) */}
        <div id="photos-section">
          <ImageSlider images={sampleImages} />
        </div>

        {/* 살롱 정보 */}
        <SalonInfo
          name="HAEYOOM | Sydney Hair Salon"
          location="SHOP 6.11, SHEPHERDS BAY PLAZA, 11A BAY DRIVE, MEADOWBANK NSW 2114"
          status="closed"
          openingTime="Friday at 9:00 AM"
          slogan="아름다운 생각, 혜윰 (Beautiful thoughts, HAEYOOM)"
          subtitle="No.1 Sydney Hair Salon"
        />

        {/* Shorts 섹션 */}
        <ShortsSection shorts={sampleShorts} />

        {/* Services 섹션 */}
        <div id="services-section">
          <ServicesList serviceCount={241} />
        </div>

        {/* Team 섹션 */}
        <div id="team-section">
          <TeamSection members={sampleTeam} />
        </div>

        {/* Reviews 섹션 */}
        <div id="reviews-section">
          <ReviewsSection
            reviews={sampleReviews}
            averageRating={4.9}
            totalReviews={2458}
          />
        </div>

        {/* Buy 섹션 */}
        <div id="buy-section">
          <BuySection options={sampleBuyOptions} />
        </div>

        {/* About 섹션 */}
        <div id="about-section">
          <AboutSection description={sampleAbout} />
        </div>

        {/* 하단 여백 추가 */}
        <div className="h-10"></div>
      </main>

      {!isAnyModalOpen && <BookingStatusBar />}

      {/* 예약 컨테이너 (datetime-selection, confirmation, completed 단계에서만 표시) */}
      {(step === "datetime-selection" ||
        step === "confirmation" ||
        step === "completed") && <BookingContainer />}
    </div>
  );
}

export default App;
