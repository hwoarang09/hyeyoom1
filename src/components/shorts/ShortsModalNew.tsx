import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import { useUIStore } from "@/store/uiStore";
import {
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ChevronLeft, // 헤더의 뒤로가기 버튼에 사용됨
} from "lucide-react";

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

// 인스타그램 릴스 스타일의 쇼츠 모달을 위한 CSS 스타일
const shortsScrollStyle = `
/* 전체 화면 스타일 */
.shorts-fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 9999;
  overflow: hidden;
}

/* 헤더 스타일 - 반투명 */
.shorts-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  display: flex;
  align-items: center;
  z-index: 50;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
}

.shorts-header-title {
  color: white;
  font-weight: 600;
  margin-left: 0.5rem;
  opacity: 0.9;
}

.shorts-back-button {
  color: white;
  opacity: 0.9;
  cursor: pointer;
  transition: opacity 0.2s;
}

.shorts-back-button:hover {
  opacity: 1;
}

/* 스크롤 컨테이너 */
.shorts-container {
  height: 100%;
  width: 100%;
  position: relative;
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.shorts-container::-webkit-scrollbar {
  display: none;
}

/* 쇼츠 아이템 */
.shorts-item {
  height: 100vh;
  width: 100%;
  position: relative;
  scroll-snap-align: start;
  overflow: hidden;
  background-color: black;
}

/* 비디오 컨테이너 - 전체 화면 채우기 */
.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
}

/* 비디오 스타일 */
.shorts-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 정보 컨테이너 - 비디오 위에 오버레이 */
.info-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  padding-bottom: 2.5rem; /* 하단 패딩 증가 */
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  color: white;
  z-index: 20;
  transform: translateY(-20px); /* 전체 컨테이너를 위로 이동 */
}

/* 스크롤 화살표 */
.scroll-arrow {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.8);
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: pulse 1.5s infinite;
  pointer-events: auto;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 8px 12px;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.scroll-arrow:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.scroll-arrow.up {
  top: 70px;
}

.scroll-arrow.down {
  bottom: 20px;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

/* 네비게이션 버튼 */
.nav-buttons {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 30;
}

/* 재생/일시정지 오버레이 */
.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 25;
  cursor: pointer;
}

/* 텍스트 스타일 */
.shorts-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: white;
}

.shorts-author {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

.shorts-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  white-space: pre-line;
  margin-bottom: 0.5rem;
}

.shorts-hashtag {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  margin-right: 0.5rem;
}

.shorts-more-button {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
  cursor: pointer;
  transition: color 0.2s;
}

.shorts-more-button:hover {
  color: rgba(255, 255, 255, 0.9);
}

.shorts-days-ago {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}
`;

const ShortsModalNew: React.FC<ShortsModalProps> = ({
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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(currentIndex);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 프로그래밍 방식으로 스크롤 중인지 여부를 추적하는 ref
  const isProgrammaticScrollRef = useRef<boolean>(false);

  // Zustand 스토어에서 모달 상태 설정 함수 가져오기
  const setModalOpen = useUIStore((state) => state.setModalOpen);

  // 모달이 열릴 때 모달 상태 설정 (전역 상태 업데이트)
  useEffect(() => {
    if (isOpen) {
      setModalOpen(true);
    }
  }, [isOpen, setModalOpen]);

  // 모든 비디오 정지 함수
  const pauseAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video && !video.paused) {
        video.pause();
      }
    });
  };

  // 특정 비디오 재생 함수
  const playVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    // 다른 모든 비디오 정지
    pauseAllVideos();

    // 현재 비디오 재생
    video.currentTime = 0; // 처음부터 재생
    video.muted = true; // 자동 재생 정책 우회를 위해 음소거 시작

    video
      .play()
      .then(() => {
        // 재생 시작 후 음소거 해제
        setTimeout(() => {
          video.muted = false;
          video.volume = 0.3;
        }, 300);
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error(`Failed to play video ${index}:`, err);
        // 자동 재생 실패 시 음소거 상태로 다시 시도
        video.muted = true;
        video.play().catch((e) => console.error("Even muted play failed:", e));
      });
  };

  // 비디오 재생/일시정지 토글
  const togglePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    try {
      if (video.paused) {
        playVideo(index);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error(`Video toggle failed:`, error);
    }
  };

  // 현재 비디오 인덱스가 변경될 때 비디오 재생
  useEffect(() => {
    playVideo(currentVideoIndex);
  }, [currentVideoIndex]);

  // 스크롤 이벤트 처리 - 비디오 전환 감지 (단순화된 버전)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || videos.length <= 1) return;

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      // 프로그래밍 방식으로 스크롤 중일 때는 인덱스 변경하지 않음
      if (isProgrammaticScrollRef.current) {
        console.log("Ignoring scroll event during programmatic scroll");
        return;
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const viewportHeight = window.innerHeight;

        // 스크롤 위치로 현재 보이는 비디오 인덱스 계산 (Math.round 대신 Math.floor 사용)
        // 각 쇼츠 아이템의 상단이 뷰포트 상단에 가까울 때 해당 인덱스로 설정
        const newIndex = Math.floor(scrollTop / viewportHeight);

        console.log(
          `Scroll position: ${scrollTop}, calculated index: ${newIndex}`
        );

        // 인덱스가 변경되었고 유효한 범위인 경우에만 업데이트
        if (
          newIndex !== currentVideoIndex &&
          newIndex >= 0 &&
          newIndex < videos.length
        ) {
          console.log(`Scroll detected: changing to video ${newIndex}`);

          // 모든 비디오 정지
          pauseAllVideos();

          // 인덱스 업데이트
          setCurrentVideoIndex(newIndex);
          if (onChangeVideo) onChangeVideo(newIndex);
        }

        scrollTimeoutRef.current = null;
      }, 300); // 스크롤 이벤트 디바운싱 시간 증가
    };

    // 스크롤 이벤트 리스너 추가
    container.addEventListener("scroll", handleScroll);

    return () => {
      // 이벤트 리스너 정리
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [videos.length, currentVideoIndex, onChangeVideo, pauseAllVideos]);

  // 스크롤 위치 설정 함수 (개선된 버전)
  const scrollToIndex = (index: number, delay: number = 50) => {
    if (!containerRef.current || videos.length <= 0) return;

    console.log(`Setting up scroll to index ${index} with delay ${delay}ms`);

    // 프로그래밍 방식 스크롤 플래그 설정
    isProgrammaticScrollRef.current = true;

    // 현재 인덱스 업데이트
    setCurrentVideoIndex(index);
    if (onChangeVideo) onChangeVideo(index);

    setTimeout(() => {
      if (containerRef.current) {
        console.log(`Executing scroll to index ${index}`);

        // 정확한 스크롤 위치 계산
        const exactScrollPosition = index * window.innerHeight;

        // 스크롤 위치 설정
        containerRef.current.scrollTo({
          top: exactScrollPosition,
          behavior: "auto", // smooth 대신 auto 사용하여 즉시 이동
        });

        // 해당 비디오 재생
        playVideo(index);

        // 스크롤 완료 후 플래그 해제 (지연 시간 증가)
        setTimeout(() => {
          // 스크롤 위치 다시 확인하고 필요하면 재조정
          if (containerRef.current) {
            const currentScrollTop = containerRef.current.scrollTop;
            if (Math.abs(currentScrollTop - exactScrollPosition) > 10) {
              console.log(
                `Scroll position drift detected, readjusting to ${exactScrollPosition}`
              );
              containerRef.current.scrollTo({
                top: exactScrollPosition,
                behavior: "auto",
              });
            }
          }

          // 플래그 해제
          isProgrammaticScrollRef.current = false;
          console.log("Programmatic scroll completed, flag reset");
        }, 500); // 지연 시간 증가
      }
    }, delay);
  };

  // currentIndex prop이 변경될 때 currentVideoIndex 상태 업데이트 및 스크롤 위치 설정
  useEffect(() => {
    if (currentIndex !== currentVideoIndex) {
      console.log(
        `Updating currentVideoIndex from ${currentVideoIndex} to ${currentIndex}`
      );

      // 스크롤 위치 업데이트 (인덱스 업데이트는 scrollToIndex 내에서 처리)
      if (isOpen && videos.length > 0) {
        scrollToIndex(currentIndex, 50);
      } else {
        // 모달이 닫혀있을 때는 인덱스만 업데이트
        setCurrentVideoIndex(currentIndex);
      }
    }
  }, [currentIndex, currentVideoIndex, isOpen, videos.length]);

  // 모달이 열릴 때 현재 비디오 자동 재생 및 스크롤 위치 설정
  useEffect(() => {
    if (isOpen && videos.length > 0) {
      // 모달이 열릴 때 스크롤 위치 설정 (DOM이 완전히 로드된 후)
      console.log(`Modal opened, scrolling to index ${currentIndex}`);
      scrollToIndex(currentIndex, 150);
    }

    // 컴포넌트 언마운트 시 모든 비디오 정지
    return () => {
      pauseAllVideos();
      document.querySelectorAll("video").forEach((video) => {
        try {
          video.pause();
          video.currentTime = 0;
        } catch (e) {
          console.error("Error stopping video:", e);
        }
      });
    };
  }, [isOpen, currentIndex, videos.length, playVideo, pauseAllVideos]);

  // 히스토리 상태 추적을 위한 ref
  const historyStateAdded = useRef<boolean>(false);

  // 브라우저 뒤로가기 버튼 처리
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 history에 상태 추가 (중복 추가 방지)
      if (!historyStateAdded.current) {
        console.log("ShortsModalNew: Adding history state");
        window.history.pushState({ modal: true }, "");
        historyStateAdded.current = true;
      }

      // 뒤로가기 이벤트 리스너 추가
      const handlePopState = () => {
        console.log("ShortsModalNew: popstate event detected");
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

  if (!isOpen) return null;

  return (
    <div className="shorts-fullscreen-modal">
      {/* 스크롤 스타일 추가 */}
      <style>{shortsScrollStyle}</style>

      {/* 반투명 헤더 */}
      <div className="shorts-header">
        <button
          onClick={onClose}
          className="shorts-back-button"
          aria-label="Back"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="shorts-header-title">Shorts</span>
      </div>

      {/* 스크롤 가능한 쇼츠 컨테이너 */}
      <div className="shorts-container" ref={containerRef}>
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
                  <video
                    key={`video-${index}-${isOpen}`}
                    src={videoUrl}
                    className="shorts-video"
                    playsInline
                    loop
                    autoPlay={index === currentVideoIndex}
                    muted={true}
                    controls={false}
                    preload="metadata"
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[index] = el;
                        el.onloadeddata = () => {
                          if (index === currentVideoIndex) {
                            el.play()
                              .then(() => {
                                setTimeout(() => {
                                  el.muted = false;
                                  el.volume = 0.3;
                                }, 500);
                              })
                              .catch((err) =>
                                console.error("Video play failed:", err)
                              );
                          }
                        };
                      }
                    }}
                    onClick={() => togglePlayPause(index)}
                  />

                  {/* 재생/일시정지 오버레이 */}
                  {index === currentVideoIndex && !isPlaying && (
                    <div className="play-overlay">
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
                    </div>
                  )}
                </div>

                {/* 정보 오버레이 */}
                <div className="info-container">
                  <h3 className="shorts-title">{itemTitle}</h3>
                  <p className="shorts-author">{itemAuthor}</p>

                  {/* 독립적인 설명 컴포넌트 사용 (해시태그 포함) */}
                  <DescriptionWithToggle
                    description={itemDescription}
                    hashtags={itemHashtags}
                  />

                  <span className="shorts-days-ago">{itemDaysAgo}일 전</span>
                </div>

                {/* 네비게이션 화살표 */}
                {index > 0 && (
                  <div
                    className="scroll-arrow up"
                    onClick={(e) => {
                      e.stopPropagation(); // 비디오 클릭 이벤트 방지
                      const prevIndex = index - 1;

                      // 먼저 현재 비디오 정지
                      pauseAllVideos();

                      // 인덱스 업데이트
                      setCurrentVideoIndex(prevIndex);
                      if (onChangeVideo) onChangeVideo(prevIndex);

                      // 스크롤 이동 (함수 사용)
                      scrollToIndex(prevIndex, 0);
                    }}
                  >
                    <ArrowUp className="h-5 w-5" />
                    <span className="text-xs mt-1">이전</span>
                  </div>
                )}

                {index < videos.length - 1 && (
                  <div
                    className="scroll-arrow down"
                    onClick={(e) => {
                      e.stopPropagation(); // 비디오 클릭 이벤트 방지
                      const nextIndex = index + 1;

                      // 먼저 현재 비디오 정지
                      pauseAllVideos();

                      // 인덱스 업데이트
                      setCurrentVideoIndex(nextIndex);
                      if (onChangeVideo) onChangeVideo(nextIndex);

                      // 스크롤 이동 (함수 사용)
                      scrollToIndex(nextIndex, 0);
                    }}
                  >
                    <span className="text-xs mb-1">다음</span>
                    <ArrowDown className="h-5 w-5" />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // 단일 비디오 표시
          <div className="shorts-item">
            <div className="video-container">
              <video
                src={videoUrl}
                className="shorts-video"
                playsInline
                loop
                autoPlay
                muted={true}
                controls={false}
                preload="metadata"
                ref={(el) => {
                  if (el) {
                    videoRef.current = el;
                    el.onloadeddata = () => {
                      // 자동 재생 정책 우회를 위해 음소거 상태로 시작
                      el.muted = true;
                      el.play()
                        .then(() => {
                          // 재생 시작 후 음소거 해제
                          setTimeout(() => {
                            el.muted = false;
                            el.volume = 0.3;
                            setIsPlaying(true);
                          }, 300);
                        })
                        .catch((err) => {
                          console.error("Video play failed:", err);
                          // 자동 재생 실패 시 음소거 상태로 유지하고 재시도
                          el.play().catch((e) =>
                            console.error("Even muted play failed:", e)
                          );
                        });
                    };
                  }
                }}
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.paused) {
                      videoRef.current
                        .play()
                        .then(() => {
                          videoRef.current!.muted = false;
                          videoRef.current!.volume = 0.3;
                          setIsPlaying(true);
                        })
                        .catch((err) => console.error("Play failed:", err));
                    } else {
                      videoRef.current.pause();
                      setIsPlaying(false);
                    }
                  }
                }}
              />

              {/* 재생/일시정지 오버레이 */}
              {!isPlaying && (
                <div className="play-overlay">
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
                </div>
              )}
            </div>

            {/* 정보 오버레이 */}
            <div className="info-container">
              <h3 className="shorts-title">{title}</h3>
              <p className="shorts-author">{author}</p>

              {/* 독립적인 설명 컴포넌트 사용 (해시태그 포함) */}
              <DescriptionWithToggle
                description={description}
                hashtags={hashtags}
              />

              <span className="shorts-days-ago">{daysAgo}일 전</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 설명 텍스트와 접기/더보기 버튼을 포함한 독립적인 컴포넌트
interface DescriptionWithToggleProps {
  description: string;
  hashtags?: string[];
}

const DescriptionWithToggle = memo(
  ({ description, hashtags = [] }: DescriptionWithToggleProps) => {
    // 컴포넌트 내부에서 상태 관리
    const [showFullDescription, setShowFullDescription] = useState(false);

    // 접기/더보기 토글 핸들러
    const handleToggleDescription = useCallback(() => {
      setShowFullDescription((prev) => !prev);
    }, []);

    // 여러 줄인지 확인
    const hasMultipleLines = description.includes("\n");

    if (!description) return null;

    return (
      <div>
        <p className="shorts-description">
          {showFullDescription ? description : description.split("\n")[0]}
        </p>

        {hasMultipleLines && (
          <button
            onClick={handleToggleDescription}
            className="shorts-more-button"
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

        {/* 해시태그 - 컴포넌트 내부에서 처리 */}
        {showFullDescription && hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {hashtags.map((tag, index) => (
              <span key={index} className="shorts-hashtag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
);

DescriptionWithToggle.displayName = "DescriptionWithToggle";

export default ShortsModalNew;
