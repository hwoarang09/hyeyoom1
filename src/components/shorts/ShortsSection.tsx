import React, { useRef } from "react";

interface Short {
  id: string;
  thumbnail: string;
  title: string;
  views: number;
}

interface ShortsSectionProps {
  shorts: Short[];
}

const ShortsSection: React.FC<ShortsSectionProps> = ({ shorts }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 최대 10개의 쇼츠만 표시
  const displayedShorts = shorts.slice(0, 10);
  const hasMoreShorts = shorts.length > 10;

  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shorts</h2>
        {hasMoreShorts && (
          <button className="text-sm text-gray-600">See all</button>
        )}
      </div>

      <div 
        className="flex overflow-x-auto scrollbar-hide gap-3 pb-2"
        ref={scrollContainerRef}
      >
        {displayedShorts.map((short) => (
          <div key={short.id} className="flex-shrink-0 w-28">
            <div className="relative aspect-[9/16] rounded-lg overflow-hidden mb-1">
              <img
                src={short.thumbnail}
                alt={short.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {short.views >= 1000
                  ? `${(short.views / 1000).toFixed(1)}K`
                  : short.views}
              </div>
            </div>
            <h3 className="text-xs font-medium truncate">{short.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortsSection;
