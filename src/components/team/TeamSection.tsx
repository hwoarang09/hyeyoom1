import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useUIStore } from "@/store/uiStore";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  rating: number;
  image: string;
  instagram?: string; // 인스타그램 링크 (선택적)
}

interface TeamSectionProps {
  members: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ members }) => {
  // 최대 4명만 표시
  const displayedMembers = members.slice(0, 4);
  const hasMoreMembers = members.length > 4;

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Zustand 스토어에서 모달 상태 설정 함수 가져오기
  const setModalOpen = useUIStore((state) => state.setModalOpen);

  // 모달 상태 변경 핸들러
  const handleModalToggle = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    setModalOpen(isOpen);
  };

  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-4">Team</h2>

      <div className="grid grid-cols-4 gap-3">
        {displayedMembers.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            <div className="relative mb-2">
              {member.instagram ? (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </a>
              ) : (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                />
              )}
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
            {member.instagram ? (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                <h3 className="font-medium text-sm">{member.name}</h3>
              </a>
            ) : (
              <h3 className="font-medium text-sm">{member.name}</h3>
            )}
            <p className="text-xs text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>

      {/* See all 버튼을 하단에 배치 */}
      {hasMoreMembers && (
        <div className="mt-4 text-center">
          <button
            onClick={() => handleModalToggle(true)}
            className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            See all
          </button>
        </div>
      )}

      {/* 팀 멤버 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => handleModalToggle(false)}
        title="Team Members"
      >
        <div className="px-4 py-4 w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map((member) => (
              <div key={member.id} className="flex flex-col items-center">
                <div className="relative mb-2">
                  {member.instagram ? (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ) : (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
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
                {member.instagram ? (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    <h3 className="font-medium text-sm">{member.name}</h3>
                  </a>
                ) : (
                  <h3 className="font-medium text-sm">{member.name}</h3>
                )}
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamSection;
