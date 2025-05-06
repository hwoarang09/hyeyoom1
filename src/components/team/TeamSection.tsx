import React from "react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  rating: number;
  image: string;
}

interface TeamSectionProps {
  members: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ members }) => {
  // 최대 4명만 표시
  const displayedMembers = members.slice(0, 4);
  const hasMoreMembers = members.length > 4;

  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Team</h2>
        {hasMoreMembers && (
          <button className="text-sm text-gray-600">See all</button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {displayedMembers.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            <div className="relative mb-2">
              <img
                src={member.image}
                alt={member.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-white rounded-full px-1.5 py-0.5 text-xs font-medium flex items-center shadow-sm">
                {member.rating}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3 ml-0.5 text-yellow-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h3 className="font-medium text-sm">{member.name}</h3>
            <p className="text-xs text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
