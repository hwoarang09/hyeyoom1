import React from "react";

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Reviews</h2>
        {hasMoreReviews && (
          <button className="text-sm text-gray-600">See all</button>
        )}
      </div>

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
    </div>
  );
};

export default ReviewsSection;
