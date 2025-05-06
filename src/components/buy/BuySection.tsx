import React from "react";

interface BuyOption {
  id: string;
  title: string;
  description: string;
}

interface BuySectionProps {
  options: BuyOption[];
}

const BuySection: React.FC<BuySectionProps> = ({ options }) => {
  // 최대 3개의 옵션만 표시
  const displayedOptions = options.slice(0, 3);
  const hasMoreOptions = options.length > 3;

  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Buy</h2>
        {hasMoreOptions && (
          <button className="text-sm text-gray-600">See all</button>
        )}
      </div>

      <div className="space-y-4">
        {displayedOptions.map((option) => (
          <div
            key={option.id}
            className="flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{option.title}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
            <button className="bg-white border border-gray-300 text-gray-800 rounded-full px-4 py-1 text-sm hover:bg-gray-50">
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuySection;
