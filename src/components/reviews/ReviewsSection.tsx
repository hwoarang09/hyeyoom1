import React, { useState, useEffect, useRef, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/store/uiStore";

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  content: string;
  avatar?: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  averageRating,
  totalReviews,
}) => {
  // 최대 2개의 리뷰만 표시
  const displayedReviews = reviews.slice(0, 2);
  const hasMoreReviews = reviews.length > 2;

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Zustand 스토어에서 모달 상태 설정 함수 가져오기
  const setModalOpen = useUIStore((state) => state.setModalOpen);

  // 모달 상태 변경 핸들러
  const handleModalToggle = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    setModalOpen(isOpen);
  };

  // 무한 스크롤을 위한 상태
  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 5;

  // 리뷰 로드 함수
  const loadMoreReviews = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // 실제 API 호출 대신 샘플 데이터를 사용하여 지연 시간 시뮬레이션
    setTimeout(() => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newReviews = reviews.slice(startIndex, endIndex);

      console.log("Loading reviews:", {
        startIndex,
        endIndex,
        newReviews,
        total: reviews.length,
      });

      if (newReviews.length > 0) {
        setVisibleReviews((prev) => [...prev, ...newReviews]);
        setPage((prev) => prev + 1);
      }

      // 더 이상 불러올 리뷰가 없는지 확인
      if (endIndex >= reviews.length) {
        setHasMore(false);
      }

      setLoading(false);
    }, 500); // 0.5초 지연
  }, [loading, hasMore, page, reviews]);

  // Intersection Observer를 사용하여 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreReviews();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreReviews, hasMore, loading]);

  // 모달이 열리면 처음 5개의 리뷰를 로드
  useEffect(() => {
    if (isModalOpen) {
      console.log("Modal opened, loading initial reviews");
      setVisibleReviews([]);
      setPage(1);
      setHasMore(true);

      // 지연 없이 바로 처음 5개를 로드
      const startIndex = 0;
      const endIndex = ITEMS_PER_PAGE;
      const initialReviews = reviews.slice(startIndex, endIndex);

      console.log("Initial reviews:", {
        initialReviews,
        total: reviews.length,
      });

      if (initialReviews.length > 0) {
        setVisibleReviews(initialReviews);
        setPage(2); // 다음 페이지부터 로드하도록 페이지 2로 설정
      }

      if (endIndex >= reviews.length) {
        setHasMore(false);
      }
    }
  }, [isModalOpen, reviews, ITEMS_PER_PAGE]);

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>

      {/* 평균 평점 */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          {renderStars(averageRating)}
          <span className="font-semibold">
            {averageRating.toFixed(1)}{" "}
            <span className="text-gray-500 font-normal">
              ({totalReviews.toLocaleString()})
            </span>
          </span>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-medium">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  review.author.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-medium">{review.author}</h3>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            </div>
            <div className="mb-1">{renderStars(review.rating)}</div>
            <p className="text-sm text-gray-700">{review.content}</p>
          </div>
        ))}
      </div>

      {/* See all 버튼을 하단에 배치 */}
      {hasMoreReviews && (
        <div className="mt-4 text-center">
          <button
            onClick={() => handleModalToggle(true)}
            className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            See all
          </button>
        </div>
      )}

      {/* 리뷰 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => handleModalToggle(false)}
        title="All Reviews"
      >
        <div className="w-full">
          {/* 평균 평점 - 상단에 고정 */}
          <div className="sticky top-0 z-10 bg-white pt-4 pb-4 px-4">
            <div className="flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="font-semibold">
                {averageRating.toFixed(1)}{" "}
                <span className="text-gray-500 font-normal">
                  ({totalReviews.toLocaleString()})
                </span>
              </span>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-200 mt-4"></div>
          </div>

          {/* 리뷰 목록 - 무한 스크롤 구현 */}
          <div className="space-y-6 px-4 py-2 pb-20">
            {visibleReviews.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center">
                <div className="animate-pulse flex space-x-4 mb-4">
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-500">Loading reviews...</p>
              </div>
            ) : (
              visibleReviews.map((review) => (
                <div
                  key={review.id}
                  className="pb-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-medium">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.author}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        review.author.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{review.author}</h3>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="mb-1">{renderStars(review.rating)}</div>
                  <p className="text-sm text-gray-700">{review.content}</p>
                </div>
              ))
            )}

            {/* 로딩 인디케이터 및 무한 스크롤을 위한 관찰 요소 */}
            <div ref={loaderRef} className="py-4 flex justify-center">
              {loading && (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                </div>
              )}
              {!hasMore && visibleReviews.length > 0 && (
                <p className="text-sm text-gray-500">No more reviews to load</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReviewsSection;
