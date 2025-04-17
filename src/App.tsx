import Navbar from "./components/layout/Navbar";
import ImageSlider from "./components/salon/ImageSlider";
import SalonInfo from "./components/salon/SalonInfo";
import ServicesList from "./components/salon/ServicesList";
import BookingBar from "./components/layout/BookingBar";

// 샘플 이미지 URL (실제 구현 시 적절한 이미지로 교체 필요)
const sampleImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
  "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
];

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto max-w-7xl pb-16">
        <ImageSlider images={sampleImages} />

        <SalonInfo
          name="Trimmings Salon & Spa | Dempsey Hill"
          location="Tanglin, Singapore"
          rating={4.9}
          reviewCount={2423}
          status="closed"
          openingTime="Friday at 9:00 AM"
        />

        <ServicesList serviceCount={241} />

        {/* 여기에 추가 섹션들을 넣을 수 있습니다 */}

        {/* 하단 여백 추가 */}
        <div className="h-10"></div>
      </main>

      <BookingBar />
    </div>
  );
}

export default App;
