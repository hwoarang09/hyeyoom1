import React, { useState } from "react";

interface AboutSectionProps {
  description: string;
  maxLength?: number;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  description,
  maxLength = 150,
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // 설명이 최대 길이보다 긴지 확인
  const isLongDescription = description.length > maxLength;
  
  // 축약된 설명 생성
  const truncatedDescription = isLongDescription && !expanded
    ? `${description.substring(0, maxLength)}...`
    : description;

  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-4">About</h2>
      
      <p className="text-sm text-gray-700">
        {truncatedDescription}
        {isLongDescription && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 font-medium ml-1"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>
    </div>
  );
};

export default AboutSection;
