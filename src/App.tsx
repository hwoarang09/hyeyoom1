import Navbar from "./components/layout/Navbar";
import ImageSlider from "./components/photos/ImageSlider";
import SalonInfo from "./components/salon/SalonInfo";
import ServicesList from "./components/services/ServicesList";
import ShortsSection from "./components/shorts/ShortsSection";
import TeamSection from "./components/team/TeamSection";
import ReviewsSection from "./components/reviews/ReviewsSection";
import BuySection from "./components/buy/BuySection";
import AboutSection from "./components/about/AboutSection";
import BookingBar from "./components/layout/BookingBar";

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
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto max-w-7xl pb-16">
        {/* Photos (이미지 슬라이더) */}
        <ImageSlider images={sampleImages} />

        {/* 살롱 정보 */}
        <SalonInfo
          name="Trimmings Salon & Spa | Dempsey Hill"
          location="Tanglin, Singapore"
          rating={4.9}
          reviewCount={2423}
          status="closed"
          openingTime="Friday at 9:00 AM"
        />

        {/* Shorts 섹션 */}
        <ShortsSection shorts={sampleShorts} />

        {/* Services 섹션 */}
        <ServicesList serviceCount={241} />

        {/* Team 섹션 */}
        <TeamSection members={sampleTeam} />

        {/* Reviews 섹션 */}
        <ReviewsSection
          reviews={sampleReviews}
          averageRating={4.9}
          totalReviews={2458}
        />

        {/* Buy 섹션 */}
        <BuySection options={sampleBuyOptions} />

        {/* About 섹션 */}
        <AboutSection description={sampleAbout} />

        {/* 하단 여백 추가 */}
        <div className="h-10"></div>
      </main>

      <BookingBar />
    </div>
  );
}

export default App;
