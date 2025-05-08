# 예약 기능 개발 문서

## 개요

이 문서는 HAEYOOM 웹사이트의 예약 기능 개발에 대한 설계와 흐름을 정리한 것입니다. 예약 기능은 사용자가 서비스를 선택하고, 날짜와 시간을 지정하여 예약을 완료하는 과정을 포함합니다.

## 용어 정의

- **BookingBar**: 화면 하단에 고정된 예약 상태 표시 및 진행 컴포넌트
- **서비스 선택**: 사용자가 예약하고자 하는 서비스를 선택하는 단계
- **날짜/시간 선택**: 예약 날짜와 시간을 선택하는 단계
- **예약 확인**: 선택한 서비스, 날짜, 시간을 확인하고 예약을 완료하는 단계

## 예약 상태 흐름

### 1. 초기 상태
- BookingBar에는 "Book now" 버튼만 표시됨
- 왼쪽에는 예약 가능 시간에 대한 정보 표시 (예: "04-19 13:00부터 예약가능")
- 사용자가 "Book now" 버튼을 클릭하면 서비스 선택 단계로 이동

### 2. 서비스 선택 상태
- 사용자가 서비스 목록에서 서비스를 선택
- 서비스 선택 시 해당 서비스의 "Book" 버튼이 체크 표시(✓)로 변경됨
- 다른 서비스의 "Book" 버튼은 "+" 버튼으로 변경되어 추가 서비스 선택 유도
- BookingBar에는 선택한 서비스 정보와 개수가 표시됨
- BookingBar의 버튼은 "Continue" 또는 "Next"로 변경됨
- 사용자가 "Continue/Next" 버튼을 클릭하면 날짜/시간 선택 단계로 이동

### 3. 날짜/시간 선택 상태
- 사용자가 예약 가능한 날짜와 시간을 선택
- BookingBar에는 선택한 서비스와 날짜/시간 정보가 표시됨
- BookingBar의 버튼은 "Continue" 또는 "Next"로 유지됨
- 사용자가 "Continue/Next" 버튼을 클릭하면 예약 확인 단계로 이동

### 4. 예약 확인 상태
- 사용자가 선택한 서비스, 날짜, 시간 정보를 확인
- BookingBar의 버튼은 "Confirm Booking"으로 변경됨
- 사용자가 "Confirm Booking" 버튼을 클릭하면 예약이 완료됨

### 5. 예약 완료 상태
- 예약이 성공적으로 완료되었음을 알리는 메시지 표시
- 예약 상세 정보 및 예약 번호 제공
- BookingBar는 초기 상태로 돌아감

## UI 컴포넌트 변경 사항

### BookingBar (이름 변경 필요)
- 초기 상태: "Book now" 버튼 표시
- 서비스 선택 후: 선택한 서비스 정보와 "Continue/Next" 버튼 표시
- 날짜/시간 선택 후: 선택한 서비스, 날짜/시간 정보와 "Continue/Next" 버튼 표시
- 예약 확인 단계: 선택한 정보와 "Confirm Booking" 버튼 표시

### 서비스 목록
- 초기 상태: 각 서비스에 "Book" 버튼 표시
- 서비스 선택 후: 선택한 서비스는 체크 표시(✓), 다른 서비스는 "+" 버튼으로 변경
- 여러 서비스 선택 가능

## 데이터 모델

### 예약 (Booking)
```typescript
interface Booking {
  id: string;
  userId: string;
  services: Service[];
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### 서비스 (Service)
```typescript
interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  category: string;
  femaleOnly?: boolean;
}
```

### 예약 가능 시간 (AvailableTime)
```typescript
interface AvailableTime {
  date: Date;
  times: string[];
}
```

## 상태 관리

예약 과정의 상태는 Zustand를 사용하여 관리합니다.

```typescript
interface BookingState {
  // 예약 단계
  step: 'initial' | 'service-selection' | 'datetime-selection' | 'confirmation' | 'completed';
  
  // 선택한 서비스 목록
  selectedServices: Service[];
  
  // 선택한 날짜와 시간
  selectedDate: Date | null;
  selectedTime: string | null;
  
  // 액션
  setStep: (step: BookingState['step']) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
  resetBooking: () => void;
}
```

## Firebase 연동

예약 데이터는 Firebase Firestore에 저장됩니다.

- 컬렉션: `bookings`
- 문서 ID: 자동 생성
- 필드: Booking 인터페이스의 필드들

## 개발 계획

1. BookingBar 컴포넌트 이름 변경 및 기능 확장
2. 예약 상태 관리를 위한 Zustand 스토어 구현
3. 서비스 선택 기능 구현
4. 날짜/시간 선택 기능 구현
5. 예약 확인 및 완료 기능 구현
6. Firebase Firestore 연동
7. 테스트 및 디버깅

## 참고 사항

- 예약 기능은 사용자 인증 후에만 사용 가능하도록 설정할 수 있음
- 예약 가능 시간은 관리자 페이지에서 설정 가능하도록 구현 가능
- 예약 알림 기능은 추후 개발 예정
