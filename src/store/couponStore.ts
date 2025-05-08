import { create } from "zustand";
import { persist } from "zustand/middleware";

// 쿠폰 인터페이스
export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: Date;
  isUsed: boolean;
  promotionId: string; // 연결된 프로모션 ID
  image?: string; // 쿠폰 이미지 (프로모션 이미지와 동일할 수 있음)
}

// 쿠폰 스토어 상태 인터페이스
interface CouponState {
  // 사용자가 보유한 쿠폰 목록
  coupons: Coupon[];
  
  // 현재 선택된 쿠폰 (예약 과정에서 사용)
  selectedCouponId: string | null;
  
  // 액션
  addCoupon: (coupon: Coupon) => void;
  removeCoupon: (couponId: string) => void;
  selectCoupon: (couponId: string | null) => void;
  useCoupon: (couponId: string) => void;
  resetSelectedCoupon: () => void;
  
  // 쿠폰 조회 헬퍼 함수
  getCouponById: (couponId: string) => Coupon | undefined;
  getValidCoupons: () => Coupon[];
  hasCouponForPromotion: (promotionId: string) => boolean;
}

// 쿠폰 스토어 생성 (로컬 스토리지에 저장)
export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: [],
      selectedCouponId: null,
      
      // 쿠폰 추가
      addCoupon: (coupon) => 
        set((state) => {
          // 이미 동일한 프로모션의 쿠폰이 있는지 확인
          const hasSamePromotion = state.coupons.some(
            (c) => c.promotionId === coupon.promotionId && !c.isUsed
          );
          
          // 이미 있다면 추가하지 않음
          if (hasSamePromotion) {
            return state;
          }
          
          return {
            coupons: [...state.coupons, coupon],
          };
        }),
      
      // 쿠폰 제거
      removeCoupon: (couponId) =>
        set((state) => ({
          coupons: state.coupons.filter((coupon) => coupon.id !== couponId),
          selectedCouponId: 
            state.selectedCouponId === couponId ? null : state.selectedCouponId,
        })),
      
      // 쿠폰 선택
      selectCoupon: (couponId) =>
        set({ selectedCouponId: couponId }),
      
      // 쿠폰 사용 처리
      useCoupon: (couponId) =>
        set((state) => ({
          coupons: state.coupons.map((coupon) =>
            coupon.id === couponId ? { ...coupon, isUsed: true } : coupon
          ),
          selectedCouponId: null,
        })),
      
      // 선택된 쿠폰 초기화
      resetSelectedCoupon: () =>
        set({ selectedCouponId: null }),
      
      // ID로 쿠폰 조회
      getCouponById: (couponId) => {
        return get().coupons.find((coupon) => coupon.id === couponId);
      },
      
      // 유효한 쿠폰 목록 조회 (사용되지 않고 만료되지 않은 쿠폰)
      getValidCoupons: () => {
        const now = new Date();
        return get().coupons.filter(
          (coupon) => 
            !coupon.isUsed && 
            new Date(coupon.expiryDate) > now
        );
      },
      
      // 특정 프로모션에 대한 쿠폰이 있는지 확인
      hasCouponForPromotion: (promotionId) => {
        return get().coupons.some(
          (coupon) => 
            coupon.promotionId === promotionId && 
            !coupon.isUsed &&
            new Date(coupon.expiryDate) > new Date()
        );
      },
    }),
    {
      name: "haeyoom-coupons", // 로컬 스토리지 키
    }
  )
);
