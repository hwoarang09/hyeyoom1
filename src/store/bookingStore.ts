import { create } from "zustand";

// 서비스 인터페이스
export interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  category: string;
  femaleOnly?: boolean;
}

// 예약 상태 인터페이스
export interface BookingState {
  // 예약 단계
  step: "initial" | "service-selection" | "datetime-selection" | "confirmation" | "completed";

  // 선택한 서비스 목록
  selectedServices: Service[];

  // 선택한 날짜와 시간
  selectedDate: Date | null;
  selectedTime: string | null;

  // 액션
  setStep: (step: BookingState["step"]) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
  resetBooking: () => void;
}

// 예약 상태 스토어 생성
export const useBookingStore = create<BookingState>((set) => ({
  // 초기 상태
  step: "initial",
  selectedServices: [],
  selectedDate: null,
  selectedTime: null,

  // 예약 단계 설정
  setStep: (step) => set({ step }),

  // 서비스 추가
  addService: (service) =>
    set((state) => {
      // 이미 선택된 서비스인지 확인
      const isAlreadySelected = state.selectedServices.some(
        (s) => s.id === service.id
      );

      // 이미 선택된 서비스라면 추가하지 않음
      if (isAlreadySelected) {
        return state;
      }

      // 서비스 추가 및 단계 업데이트
      return {
        selectedServices: [...state.selectedServices, service],
        step:
          state.step === "initial" ? "service-selection" : state.step,
      };
    }),

  // 서비스 제거
  removeService: (serviceId) =>
    set((state) => {
      // 선택된 서비스에서 제거
      const updatedServices = state.selectedServices.filter(
        (service) => service.id !== serviceId
      );

      // 선택된 서비스가 없으면 초기 단계로 돌아감
      const updatedStep =
        updatedServices.length === 0 ? "initial" : state.step;

      return {
        selectedServices: updatedServices,
        step: updatedStep,
      };
    }),

  // 날짜 설정
  setDate: (date) =>
    set((state) => ({
      selectedDate: date,
      step:
        state.step === "service-selection"
          ? "datetime-selection"
          : state.step,
    })),

  // 시간 설정
  setTime: (time) =>
    set((state) => ({
      selectedTime: time,
      step:
        state.step === "datetime-selection" && state.selectedDate
          ? "confirmation"
          : state.step,
    })),

  // 예약 상태 초기화
  resetBooking: () =>
    set({
      step: "initial",
      selectedServices: [],
      selectedDate: null,
      selectedTime: null,
    }),
}));
