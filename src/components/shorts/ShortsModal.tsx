import React, { useRef, useState, useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import Modal from "@/components/ui/Modal";
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown } from "lucide-react";

interface ShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  description?: string;
  author?: string;
  hashtags?: string[];
  daysAgo?: number;
  videos?: string[];
  titles?: string[];
  descriptions?: string[];
  authors?: string[];
  hashtagsList?: string[][];
  daysAgoList?: number[];
  onChangeVideo?: (index: number) => void;
  currentIndex?: number;
}

// 스크롤 기반 쇼츠 네비게이션을 위한 CSS 스타일
const shortsScrollStyle = `
/* 스크롤 문제 해결을 위한 개선된 스타일 - 덜 민감한 스크롤 */
.shorts-container {
  scroll-snap-type: none; /* 스크롤 스냅 비활성화 - 자동으로 다음 쇼츠로 넘어가지 않음 */
  height: 100%; /* 모달 컨텐츠 영역 전체 높이 사용 */
  overflow-y: auto;
  position: relative;
  scroll-behavior: smooth; /* 부드러운 스크롤 효과 */
  overscroll-behavior: contain; /* 스크롤 경계에서 바운스 방지 */
  touch-action: pan-y; /* 수직 스크롤만 허용 */
  -webkit-overflow-scrolling: touch; /* iOS 스크롤 개선 */
  -ms-overflow-style: none; /* IE/Edge 스크롤바 숨김 */
  scrollbar-width: none; /* Firefox 스크롤바 숨김 */
}

/* 스크롤바 숨김 (Chrome, Safari, Opera) */
.shorts-container::-webkit-scrollbar {
  display: none;
}

.shorts-item {
  /* 스크롤 스냅 속성 제거 - 자동으로 다음 쇼츠로 넘어가지 않음 */
  height: 100%; /* 컨테이너 높이에 맞춤 */
  min-height: 100vh; /* 최소 뷰포트 높이 */
  max-height: calc(100vh - 60px); /* 모달 헤더 높이 고려 */
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 내용이 넘치지 않도록 */
  will-change: transform; /* 성능 최적화 */
  margin-bottom: 20px; /* 쇼츠 아이템 사이에 약간의 간격 추가 */
}

.video-container {
  flex: 1;
  background-color: black;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60%;
}

/* 텍스트 영역 스크롤 개선 */
.info-container {
  background-color: white;
  padding: 1rem;
  overflow-y: auto; /* 설명 영역만 스크롤 가능하도록 */
  max-height: 40%;
  overscroll-behavior: contain; /* 텍스트 영역 스크롤이 전체 스크롤에 영향을 주지 않도록 */
  touch-action: pan-y; /* 수직 스크롤만 허용 */
}

/* 스크롤 방지 영역 - 텍스트 영역 스크롤 시 전체 스크롤 방지 */
.prevent-scroll {
  touch-action: none;
  pointer-events: none;
}

/* 스크롤바 숨기기 */
.shorts-container::-webkit-scrollbar {
  display: none;
}
.shorts-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 스크롤 화살표 스타일 - 클릭 가능하도록 개선 */
.scroll-arrow {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: pulse 1.5s infinite;
  pointer-events: auto; /* 화살표 클릭 가능하도록 변경 */
  cursor: pointer; /* 커서 변경으로 클릭 가능함을 표시 */
  background-color: rgba(0, 0, 0, 0.3); /* 배경 추가로 가시성 향상 */
  padding: 8px 12px;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.scroll-arrow:hover {
  background-color: rgba(0, 0, 0, 0.5); /* 호버 시 배경 어둡게 */
}

.scroll-arrow.up {
  top: 10px;
}

.scroll-arrow.down {
  bottom: 10px;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

/* 네비게이션 버튼 스타일 */
.nav-buttons {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

/* 모달 내부 스크롤 방지 */
.modal-content-override {
  overflow: hidden !important;
}
`;

const ShortsModal: React.FC<ShortsModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title,
  description = "반년전에 젤리펌 시술받으시고 커트만으로 빈티지펌 스타일 해드렸어요✨\n모발이 얇으신분\n볼륨이 부족하신분\n머리손질이 힘드신분들께 추천드려요!",
  author = "@hae.yoonhoon",
  hashtags = [
    "sydneyhair",
    "sydneykoreanhairsalon",
    "sydneyhairdresser",
    "sydneyhairsalon",
    "sydneyhairstylist",
    "시드니미용실",
    "시드니한인미용실",
    "시드니젤리펌",
    "시드니빈티지펌",
    "시드니히피펌",
  ],
  daysAgo = 4,
  videos = [],
  titles = [],
  descriptions = [],
  authors = [],
  hashtagsList = [],
  daysAgoList = [],
  onChangeVideo,
  currentIndex = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartRef = useRef<number>(0);
  const touchEndRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(currentIndex);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const container = containerRef.current;
    if (!container || videos.length <= 1) return;

    // 현재 보이는 비디오 인덱스를 결정하는 함수
    const determineVisibleVideoIndex = () => {
      if (!container) return;

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // 각 쇼츠 아이템의 높이는 containerHeight와 동일
      // Math.round 대신 Math.floor 사용하여 더 정확한 스냅 동작
      const visibleIndex = Math.floor(
        (scrollTop + containerHeight / 3) / containerHeight
      );

      // 인덱스가 변경되었을 때만 상태 업데이트
      if (
        visibleIndex !== currentVideoIndex &&
        visibleIndex >= 0 &&
        visibleIndex < videos.length
      ) {
        console.log(
          `Changing video index to ${visibleIndex} (scroll position: ${scrollTop})`
        );
        setCurrentVideoIndex(visibleIndex);
        if (onChangeVideo) onChangeVideo(visibleIndex);

        // 현재 비디오 재생, 다른 비디오 일시정지
        videoRefs.current.forEach((video, idx) => {
          if (!video) return;

          if (idx === visibleIndex) {
            // 현재 보이는 비디오 재생
            video
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((err) => console.error(`Video ${idx} play error:`, err));
          } else {
            // 화면에 보이지 않는 비디오 일시정지
            if (!video.paused) {
              video.pause();
            }
          }
        });
      }
    };

    // 스크롤 이벤트 핸들러 - Intersection Observer 사용
    const videoObservers: IntersectionObserver[] = [];

    // 각 비디오 요소에 대한 Intersection Observer 설정
    const setupIntersectionObservers = () => {
      // Intersection Observer API가 지원되지 않는 브라우저 확인
      if (!("IntersectionObserver" in window)) {
        console.log("IntersectionObserver not supported, using fallback");
        return; // 폴백 메커니즘으로 스크롤 이벤트만 사용
      }

      // 기존 옵저버 정리
      videoObservers.forEach((observer) => observer.disconnect());
      videoObservers.length = 0;

      // 각 쇼츠 아이템에 대한 옵저버 생성
      const shortsItems = container.querySelectorAll(".shorts-item");
      shortsItems.forEach((item, index) => {
        try {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                  // 임계값 낮춤
                  // 50% 이상 보이면 현재 비디오로 간주
                  if (currentVideoIndex !== index) {
                    console.log(`Observer detected video ${index} is visible`);
                    setCurrentVideoIndex(index);
                    if (onChangeVideo) onChangeVideo(index);

                    // 비디오 재생/일시정지 처리
                    videoRefs.current.forEach((video, idx) => {
                      if (!video) return;

                      if (idx === index) {
                        video
                          .play()
                          .catch((err) =>
                            console.error(`Video ${idx} play error:`, err)
                          );
                        setIsPlaying(true);
                      } else if (!video.paused) {
                        video.pause();
                      }
                    });
                  }
                }
              });
            },
            {
              root: container,
              threshold: [0.2, 0.5, 0.8], // 여러 임계값 설정
              rootMargin: "0px",
            }
          );

          observer.observe(item);
          videoObservers.push(observer);
        } catch (error) {
          console.error("Error setting up IntersectionObserver:", error);
        }
      });
    };

    // 스크롤 이벤트 핸들러 - 백업 메커니즘
    const handleScroll = () => {
      // 스크롤 이벤트가 너무 자주 발생하지 않도록 throttle 적용
      if (!scrollTimeoutRef.current) {
        scrollTimeoutRef.current = setTimeout(() => {
          determineVisibleVideoIndex();
          scrollTimeoutRef.current = null;
        }, 100);
      }
    };

    // 키보드 이벤트 핸들러 (PC용)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault(); // 기본 스크롤 동작 방지

        const direction = e.key === "ArrowUp" ? -1 : 1;
        const nextIndex = currentVideoIndex + direction;

        if (nextIndex >= 0 && nextIndex < videos.length) {
          // 다음/이전 쇼츠로 스크롤
          container.scrollTo({
            top: nextIndex * container.clientHeight,
            behavior: "smooth",
          });
        }
      }
    };

    // 초기 로드 시 현재 인덱스에 해당하는 쇼츠로 스크롤
    if (
      currentIndex !== undefined &&
      currentIndex >= 0 &&
      currentIndex < videos.length
    ) {
      // 약간의 지연 후 스크롤 (DOM이 완전히 로드된 후)
      setTimeout(() => {
        if (container) {
          container.scrollTop = currentIndex * container.clientHeight;

          // 현재 비디오 재생
          const currentVideo = videoRefs.current[currentIndex];
          if (currentVideo) {
            currentVideo
              .play()
              .catch((err) => console.error("Video play error:", err));
          }

          // Intersection Observer 설정
          setupIntersectionObservers();
        }
      }, 300);
    }

    // 터치 이벤트 핸들러 (모바일용) - 개선된 버전
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    let touchEndTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      touchStartRef.current = touchStartY;

      // 터치 시작 시 스크롤 동작 일시 중지 (더 정확한 스와이프 감지를 위해)
      if (container) {
        container.style.scrollBehavior = "auto";
      }
    };

    const handleTouchMove = (_e: TouchEvent) => {
      // 터치 이동 중 기본 스크롤 동작 방지 (선택적)
      // _e.preventDefault(); // 주의: 이 코드는 모든 스크롤을 방지할 수 있음
      // 현재는 이벤트를 사용하지 않지만, 필요할 경우 활성화
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].clientY;
      touchEndTime = Date.now();
      touchEndRef.current = touchEndY;

      // 터치 방향 및 속도 감지
      const touchDiff = touchStartY - touchEndY;
      const timeDiff = touchEndTime - touchStartTime;
      const velocity = Math.abs(touchDiff) / timeDiff; // 스와이프 속도

      // 스크롤 동작 복원
      if (container) {
        container.style.scrollBehavior = "smooth";
      }

      // 빠른 스와이프 또는 충분한 거리의 스와이프 감지
      // 빠른 스와이프는 더 짧은 거리로도 인식
      const isQuickSwipe = velocity > 0.5; // 초당 0.5 픽셀 이상
      const minDistance = isQuickSwipe ? 30 : 80; // 빠른 스와이프는 더 짧은 거리로 인식

      if (Math.abs(touchDiff) < minDistance) return;

      // 방향에 따라 다음/이전 비디오로 이동
      const direction = touchDiff > 0 ? 1 : -1; // 위로 스와이프: 다음, 아래로 스와이프: 이전
      const nextIndex = currentVideoIndex + direction;

      if (nextIndex >= 0 && nextIndex < videos.length) {
        console.log(
          `Swiping to video ${nextIndex} (direction: ${
            direction > 0 ? "up" : "down"
          })`
        );

        // 다음/이전 쇼츠로 스크롤
        container.scrollTo({
          top: nextIndex * container.clientHeight,
          behavior: "smooth",
        });

        // 스크롤 이벤트가 제대로 발생하지 않을 경우를 대비해 직접 인덱스 변경
        setTimeout(() => {
          if (currentVideoIndex !== nextIndex) {
            setCurrentVideoIndex(nextIndex);
            if (onChangeVideo) onChangeVideo(nextIndex);
          }
        }, 300);
      }
    };

    // 이벤트 리스너 추가
    container.addEventListener("scroll", handleScroll);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);

    // 윈도우 크기 변경 시 스크롤 위치 조정 및 옵저버 재설정
    const handleResize = () => {
      if (container) {
        container.scrollTop = currentVideoIndex * container.clientHeight;

        // 화면 크기가 변경되면 Intersection Observer 재설정
        setupIntersectionObservers();
      }
    };

    window.addEventListener("resize", handleResize);

    // 초기 Intersection Observer 설정
    setupIntersectionObservers();

    return () => {
      // 이벤트 리스너 제거
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);

      // 타임아웃 정리
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // 옵저버 정리
      videoObservers.forEach((observer) => observer.disconnect());
    };
  }, [currentVideoIndex, videos.length, onChangeVideo, currentIndex]);

  // currentIndex prop이 변경될 때 currentVideoIndex 업데이트 - 단순화된 버전
  useEffect(() => {
    // 현재 인덱스가 변경되었을 때만 상태 업데이트
    if (currentVideoIndex !== currentIndex) {
      setCurrentVideoIndex(currentIndex);

      // 컨테이너가 있으면 해당 인덱스로 스크롤
      if (containerRef.current && videos.length > 0) {
        containerRef.current.scrollTop =
          currentIndex * containerRef.current.clientHeight;
      }
    }
  }, [currentIndex, videos.length, currentVideoIndex]);

  // 현재 비디오 인덱스가 변경될 때 비디오 재생 및 다른 비디오 일시정지 - 소리 문제 해결 버전
  useEffect(() => {
    // 설명 접기
    setShowFullDescription(false);

    // 비디오 요소들이 아직 준비되지 않았을 수 있으므로 약간의 지연 후 처리
    setTimeout(() => {
      try {
        // 모든 비디오 확인 및 제어
        videoRefs.current.forEach((video, index) => {
          if (!video) return;

          if (index === currentVideoIndex) {
            // 현재 비디오 재생 - 처음에는 음소거 상태로 시작
            if (video.paused) {
              video.muted = true; // 자동 재생 정책 우회를 위해 음소거

              video
                .play()
                .then(() => {
                  // 재생 시작 후 약간의 지연을 두고 음소거 해제
                  setTimeout(() => {
                    try {
                      video.muted = false;
                      video.volume = 0.3;
                    } catch (err) {
                      console.error(`Failed to unmute video ${index}:`, err);
                    }
                  }, 300);
                })
                .catch((error) => {
                  console.error(`Failed to play video ${index}:`, error);
                });
            }
          } else {
            // 다른 비디오 일시정지
            if (!video.paused) {
              video.pause();
            }
          }
        });
      } catch (error) {
        console.error("Error controlling videos:", error);
      }
    }, 100);
  }, [currentVideoIndex]);

  // Zustand 스토어에서 모달 상태 설정 함수 가져오기
  const setModalOpen = useUIStore((state) => state.setModalOpen);

  // 모달이 열릴 때 모달 상태 설정 (전역 상태 업데이트)
  useEffect(() => {
    // 전역 상태 업데이트 - 이미 ShortsSection에서 설정되었을 수 있으므로 중복 호출 방지
    if (isOpen) {
      setModalOpen(true);
    }
  }, [isOpen, setModalOpen]);

  // 비디오 재생/일시정지 토글 - 소리 문제 해결 버전
  const togglePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    try {
      if (video.paused) {
        // 재생 시작
        video
          .play()
          .then(() => {
            // 재생 성공 후 볼륨 설정
            try {
              video.muted = false; // 음소거 해제
              video.volume = 0.3; // 볼륨 설정
            } catch (err) {
              console.error("Failed to set volume:", err);
            }
          })
          .catch((err) => {
            console.error("Play failed on toggle:", err);

            // 자동 재생 정책 문제일 수 있으므로 음소거 상태로 재생 시도
            video.muted = true;
            video.play().then(() => {
              // 사용자에게 음소거 상태임을 알림 (실제 구현에서는 UI로 표시)
              console.log("Video is playing muted due to autoplay policy");
            });
          });
      } else {
        video.pause();
      }
    } catch (error) {
      console.error(`Video toggle failed:`, error);
    }
  };

  // 모달이 열릴 때 현재 비디오 자동 재생 - 단순화된 버전
  useEffect(() => {
    // 모달이 열릴 때
    if (isOpen) {
      // 약간의 지연 후 스크롤 위치 설정 (DOM이 완전히 로드된 후)
      setTimeout(() => {
        // 컨테이너가 있으면 해당 인덱스로 스크롤
        if (containerRef.current && videos.length > 0) {
          // 스크롤 위치 재설정
          containerRef.current.scrollTop =
            currentVideoIndex * containerRef.current.clientHeight;
        }
      }, 300);
    }
    // 모달이 닫힐 때
    else {
      // 모든 비디오 정지 (소리가 계속 나오는 문제 해결)
      document.querySelectorAll("video").forEach((video) => {
        try {
          video.pause();
          video.currentTime = 0;
          video.volume = 0;
        } catch (e) {
          console.error("Error stopping video:", e);
        }
      });
    }

    // 컴포넌트 언마운트 시
    return () => {
      // 모든 비디오 정지
      document.querySelectorAll("video").forEach((video) => {
        try {
          video.pause();
          video.currentTime = 0;
          video.volume = 0;
        } catch (e) {
          console.error("Error stopping video on unmount:", e);
        }
      });
    };
  }, [isOpen, currentVideoIndex, videos.length]);

  // 이전 코드에서 사용하지 않는 변수들 제거

  // 히스토리 상태 추적을 위한 ref
  const historyStateAdded = useRef(false);

  // 브라우저 뒤로가기 버튼 처리를 위한 개선된 핸들러
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 history에 상태 추가 (중복 추가 방지)
      if (!historyStateAdded.current) {
        window.history.pushState({ modal: true }, "");
        historyStateAdded.current = true;
      }

      // 뒤로가기 이벤트 리스너 추가
      const handlePopState = () => {
        console.log("ShortsModal: popstate event detected");
        onClose();
        historyStateAdded.current = false;
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    } else {
      // 모달이 닫힐 때 히스토리 상태 추가 여부 초기화
      historyStateAdded.current = false;
    }
  }, [isOpen, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shorts"
      contentClassName="modal-content-override"
      bgColor="bg-black"
      textColor="text-white"
    >
      {/* 스크롤 스타일 추가 */}
      <style>{shortsScrollStyle}</style>

      {/* 스크롤 가능한 쇼츠 컨테이너 */}
      <div className="shorts-container" ref={containerRef}>
        {/* 각 쇼츠 아이템 렌더링 */}
        {videos.length > 0 ? (
          videos.map((videoUrl, index) => {
            const itemTitle = titles[index] || title;
            const itemDescription = descriptions[index] || description;
            const itemAuthor = authors[index] || author;
            const itemHashtags = hashtagsList[index] || hashtags;
            const itemDaysAgo = daysAgoList[index] || daysAgo;

            return (
              <div key={`shorts-${index}`} className="shorts-item">
                {/* 비디오 영역 */}
                <div className="video-container">
                  {/* 이전 비디오 화살표 (첫 번째 비디오가 아닐 때) */}
                  {index > 0 && (
                    <div
                      className="scroll-arrow up"
                      onClick={(e) => {
                        e.stopPropagation(); // 비디오 클릭 이벤트 방지
                        // 이전 비디오로 스크롤
                        if (containerRef.current) {
                          const prevIndex = index - 1;
                          containerRef.current.scrollTop =
                            prevIndex * containerRef.current.clientHeight;
                          setCurrentVideoIndex(prevIndex);
                          if (onChangeVideo) onChangeVideo(prevIndex);
                        }
                      }}
                    >
                      <ArrowUp className="h-5 w-5" />
                      <span className="text-xs mt-1">이전 비디오</span>
                    </div>
                  )}

                  <video
                    key={`video-${index}-${isOpen}`}
                    src={videoUrl}
                    className="w-full h-full object-cover md:object-contain"
                    playsInline
                    loop
                    autoPlay={index === currentVideoIndex}
                    muted={
                      true
                    } /* 처음에는 음소거로 시작 - 자동 재생 정책 우회 */
                    controls
                    preload="metadata"
                    controlsList="nodownload"
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[index] = el;

                        // 비디오가 로드되면 실행
                        el.onloadeddata = () => {
                          if (index === currentVideoIndex) {
                            // 자동 재생 시작
                            el.play()
                              .then(() => {
                                // 재생이 시작된 후 약간의 지연을 두고 볼륨 설정
                                setTimeout(() => {
                                  try {
                                    el.muted = false; // 음소거 해제
                                    el.volume = 0.3; // 볼륨 설정
                                  } catch (err) {
                                    console.error(
                                      "Failed to unmute video:",
                                      err
                                    );
                                  }
                                }, 500);
                              })
                              .catch((err) =>
                                console.error("Video play failed:", err)
                              );
                          }
                        };
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={() => togglePlayPause(index)}
                  />

                  {/* 다음 비디오 화살표 (마지막 비디오가 아닐 때) */}
                  {index < videos.length - 1 && (
                    <div
                      className="scroll-arrow down"
                      onClick={(e) => {
                        e.stopPropagation(); // 비디오 클릭 이벤트 방지
                        // 다음 비디오로 스크롤
                        if (containerRef.current) {
                          const nextIndex = index + 1;
                          containerRef.current.scrollTop =
                            nextIndex * containerRef.current.clientHeight;
                          setCurrentVideoIndex(nextIndex);
                          if (onChangeVideo) onChangeVideo(nextIndex);
                        }
                      }}
                    >
                      <span className="text-xs mb-1">다음 비디오</span>
                      <ArrowDown className="h-5 w-5" />
                    </div>
                  )}

                  {/* 측면 네비게이션 버튼 */}
                  <div className="nav-buttons">
                    {index > 0 && (
                      <button
                        className="bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 이전 비디오로 이동
                          if (containerRef.current) {
                            const prevIndex = index - 1;
                            containerRef.current.scrollTop =
                              prevIndex * containerRef.current.clientHeight;
                            setCurrentVideoIndex(prevIndex);
                            if (onChangeVideo) onChangeVideo(prevIndex);
                          }
                        }}
                      >
                        <ArrowUp className="h-6 w-6 text-white" />
                      </button>
                    )}

                    {index < videos.length - 1 && (
                      <button
                        className="bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 다음 비디오로 이동
                          if (containerRef.current) {
                            const nextIndex = index + 1;
                            containerRef.current.scrollTop =
                              nextIndex * containerRef.current.clientHeight;
                            setCurrentVideoIndex(nextIndex);
                            if (onChangeVideo) onChangeVideo(nextIndex);
                          }
                        }}
                      >
                        <ArrowDown className="h-6 w-6 text-white" />
                      </button>
                    )}
                  </div>

                  {/* 재생/일시정지 오버레이 버튼 */}
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => togglePlayPause(index)}
                  >
                    {index === currentVideoIndex && !isPlaying && (
                      <div className="bg-black/30 rounded-full p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* 설명 영역 */}
                <div className="info-container">
                  {/* 작성자 및 제목 */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{itemTitle}</h3>
                      <p className="text-sm font-medium text-gray-700">
                        {itemAuthor}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {itemDaysAgo}일 전
                    </span>
                  </div>

                  {/* 설명 */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {index === currentVideoIndex && showFullDescription
                        ? itemDescription
                        : itemDescription.split("\n")[0]}
                    </p>

                    {itemDescription.includes("\n") && (
                      <button
                        onClick={() =>
                          index === currentVideoIndex &&
                          setShowFullDescription(!showFullDescription)
                        }
                        className="flex items-center text-xs text-gray-500 mt-1 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
                      >
                        {index === currentVideoIndex && showFullDescription ? (
                          <>
                            <span>접기</span>
                            <ChevronUp className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            <span>더보기</span>
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* 해시태그 */}
                  <div
                    className={`flex flex-wrap gap-1 mt-2 ${
                      index === currentVideoIndex && showFullDescription
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    {itemHashtags.map((tag, tagIndex) => (
                      <span
                        key={`tag-${index}-${tagIndex}`}
                        className="text-xs text-blue-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // 비디오가 없을 경우 기본 비디오 표시
          <div className="shorts-item">
            <div className="video-container">
              <video
                key={`single-video-${isOpen}`}
                src={videoUrl}
                className="w-full h-full object-cover md:object-contain"
                playsInline
                loop
                autoPlay
                muted={true} /* 처음에는 음소거로 시작 - 자동 재생 정책 우회 */
                controls
                preload="metadata"
                controlsList="nodownload"
                ref={(el) => {
                  if (el) {
                    videoRef.current = el;

                    // 비디오가 로드되면 실행
                    el.onloadeddata = () => {
                      // 자동 재생 시작
                      el.play()
                        .then(() => {
                          // 재생이 시작된 후 약간의 지연을 두고 볼륨 설정
                          setTimeout(() => {
                            try {
                              el.muted = false; // 음소거 해제
                              el.volume = 0.3; // 볼륨 설정
                            } catch (err) {
                              console.error(
                                "Failed to unmute single video:",
                                err
                              );
                            }
                          }, 500);
                        })
                        .catch((err) =>
                          console.error("Single video play failed:", err)
                        );
                    };
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={() => togglePlayPause(0)}
              />

              {/* 단일 비디오에는 네비게이션 버튼 없음 */}
            </div>

            <div className="info-container">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm font-medium text-gray-700">{author}</p>
                </div>
                <span className="text-xs text-gray-500">{daysAgo}일 전</span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {showFullDescription
                    ? description
                    : description.split("\n")[0]}
                </p>

                {description.includes("\n") && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="flex items-center text-xs text-gray-500 mt-1 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
                  >
                    {showFullDescription ? (
                      <>
                        <span>접기</span>
                        <ChevronUp className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        <span>더보기</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>

              <div
                className={`flex flex-wrap gap-1 mt-2 ${
                  showFullDescription ? "block" : "hidden"
                }`}
              >
                {hashtags.map((tag, index) => (
                  <span key={index} className="text-xs text-blue-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShortsModal;
