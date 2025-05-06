import { create } from "zustand";

interface UIState {
  // 모달이 열려있는지 여부를 추적하는 상태
  isAnyModalOpen: boolean;

  // 모달이 열리기 전 스크롤 위치
  previousScrollPosition: number;

  // 모달 상태를 설정하는 액션
  setModalOpen: (isOpen: boolean) => void;

  // 스크롤 위치를 저장하는 액션
  saveScrollPosition: (position: number) => void;
}

// UI 상태를 관리하는 스토어 생성
export const useUIStore = create<UIState>((set) => ({
  isAnyModalOpen: false,
  previousScrollPosition: 0,

  setModalOpen: (isOpen: boolean) => set({ isAnyModalOpen: isOpen }),
  saveScrollPosition: (position: number) =>
    set({ previousScrollPosition: position }),
}));
