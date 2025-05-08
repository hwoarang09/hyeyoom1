// 샘플 이미지 URL (실제 구현 시 적절한 이미지로 교체 필요)
export const sampleImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
  "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
];

// 샘플 쇼츠 데이터
export const sampleShorts = [
  {
    id: "1",
    thumbnail:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    title: "Summer Hairstyle Tips",
    views: 1200,
  },
  {
    id: "2",
    thumbnail:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    title: "Quick Nail Art Tutorial",
    views: 850,
  },
  {
    id: "3",
    thumbnail:
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    title: "Facial Treatment Process",
    views: 2300,
  },
  {
    id: "4",
    thumbnail:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    title: "Salon Tour",
    views: 1500,
  },
];

// 위치 관련 릴스 데이터 - public/reels/location 폴더의 실제 동영상 파일 사용 (852, 250, 565 순서로 변경)
export const locationReels = [
  {
    id: "loc1",
    thumbnail:
      "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "How to get to HAEYOOM",
    videoUrl: "/reels/location/Video-852.mp4", // 경로 수정
  },
  {
    id: "loc2",
    thumbnail:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    title: "How to get to HAEYOOM",
    videoUrl: "/reels/location/Video-250.mp4", // 경로 수정
  },
  {
    id: "loc3",
    thumbnail:
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80",
    title: "How to get to HAEYOOM",
    videoUrl: "/reels/location/Video-565.mp4", // 경로 수정
  },
];

// 샘플 팀 데이터
export const sampleTeam = [
  {
    id: "1",
    name: "Yoon Hoon",
    role: "Hair Stylist",
    rating: 4.9,
    image: "/images/team/yoon_hoon.png", // public 폴더의 이미지 경로
    instagram: "https://www.instagram.com/hae.yoonhoon/",
  },
  {
    id: "2",
    name: "Tae Hoon",
    role: "Hair Stylist",
    rating: 4.8,
    image: "/images/team/tae_hoon.png", // public 폴더의 이미지 경로
    instagram: "https://www.instagram.com/hae.taehoon/",
  },
  {
    id: "3",
    name: "Helen",
    role: "Manicurist",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
  },
  {
    id: "4",
    name: "Shan",
    role: "Manicurist",
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: "5",
    name: "Henna",
    role: "Manicurist",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "6",
    name: "Moo",
    role: "Manicurist",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
  },
  {
    id: "7",
    name: "Jane",
    role: "Hair Stylist",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
];

// 샘플 리뷰 데이터
export const sampleReviews = [
  {
    id: "1",
    author: "Tracey W",
    date: "Today at 3:20 PM",
    rating: 5,
    content: "As always perfection by the team!",
  },
  {
    id: "2",
    author: "Sarah L",
    date: "Yesterday at 1:45 PM",
    rating: 4,
    content:
      "Great service, very professional and friendly staff. Will definitely come back!",
  },
  {
    id: "3",
    author: "Michael K",
    date: "2 days ago",
    rating: 5,
    content: "Best salon in the area. The haircut was exactly what I wanted.",
  },
  {
    id: "4",
    author: "Jennifer P",
    date: "3 days ago",
    rating: 5,
    content:
      "I love my new hairstyle! The stylist really understood what I was looking for and delivered beyond my expectations.",
  },
  {
    id: "5",
    author: "David R",
    date: "Last week",
    rating: 4,
    content:
      "Very relaxing experience. The massage was excellent and the staff was attentive to my needs.",
  },
  {
    id: "6",
    author: "Emma T",
    date: "Last week",
    rating: 5,
    content:
      "The manicure was perfect! My nails have never looked better. Will be coming back regularly.",
  },
  {
    id: "7",
    author: "Alex M",
    date: "2 weeks ago",
    rating: 3,
    content:
      "Good service but had to wait a bit longer than expected. The results were satisfactory though.",
  },
  {
    id: "8",
    author: "Sophia L",
    date: "2 weeks ago",
    rating: 5,
    content:
      "The facial treatment was amazing! My skin feels so refreshed and the therapist was very knowledgeable.",
  },
  {
    id: "9",
    author: "James B",
    date: "3 weeks ago",
    rating: 4,
    content:
      "Solid haircut and great atmosphere. The only reason I'm not giving 5 stars is because the pricing is a bit on the higher side.",
  },
  {
    id: "10",
    author: "Olivia K",
    date: "Last month",
    rating: 5,
    content:
      "I've been coming here for years and have never been disappointed. The team is consistently excellent and the salon is always clean and welcoming.",
  },
  {
    id: "11",
    author: "Ryan T",
    date: "Last month",
    rating: 4,
    content:
      "The stylist was very attentive and gave me exactly the look I was going for. Will definitely return.",
  },
  {
    id: "12",
    author: "Mia C",
    date: "Last month",
    rating: 5,
    content:
      "Absolutely loved my experience here! The staff was friendly and my hair looks amazing.",
  },
  {
    id: "13",
    author: "Daniel H",
    date: "2 months ago",
    rating: 3,
    content:
      "Decent service but a bit pricey for what you get. The ambiance is nice though.",
  },
  {
    id: "14",
    author: "Natalie F",
    date: "2 months ago",
    rating: 5,
    content:
      "The pedicure was so relaxing and my feet have never looked better! The staff was very professional.",
  },
  {
    id: "15",
    author: "Chris P",
    date: "2 months ago",
    rating: 4,
    content:
      "Great haircut and the staff was very accommodating when I needed to reschedule.",
  },
  {
    id: "16",
    author: "Lily R",
    date: "3 months ago",
    rating: 5,
    content:
      "The color treatment was perfect! My hair looks so vibrant and healthy. Highly recommend their coloring services.",
  },
  {
    id: "17",
    author: "Thomas G",
    date: "3 months ago",
    rating: 4,
    content:
      "Very clean salon with a professional atmosphere. My haircut was exactly what I asked for.",
  },
  {
    id: "18",
    author: "Hannah M",
    date: "3 months ago",
    rating: 5,
    content:
      "The facial was incredible! My skin is glowing and the esthetician was very knowledgeable about skincare.",
  },
  {
    id: "19",
    author: "Kevin L",
    date: "4 months ago",
    rating: 3,
    content:
      "The service was okay but I had to wait 20 minutes past my appointment time which was frustrating.",
  },
  {
    id: "20",
    author: "Zoe S",
    date: "4 months ago",
    rating: 5,
    content:
      "Best massage I've ever had! The therapist really worked out all my knots and I left feeling so relaxed.",
  },
  {
    id: "21",
    author: "Brandon K",
    date: "4 months ago",
    rating: 4,
    content:
      "Good haircut and friendly service. The salon has a nice vibe and the staff is very welcoming.",
  },
  {
    id: "22",
    author: "Isabella J",
    date: "5 months ago",
    rating: 5,
    content:
      "The highlights look amazing! The stylist really understood the look I was going for and executed it perfectly.",
  },
  {
    id: "23",
    author: "Tyler W",
    date: "5 months ago",
    rating: 4,
    content:
      "Solid barbering skills and good conversation. The hot towel treatment at the end was a nice touch.",
  },
  {
    id: "24",
    author: "Grace H",
    date: "5 months ago",
    rating: 5,
    content:
      "The nail art was stunning! The technician was so detailed and creative. I've received so many compliments.",
  },
  {
    id: "25",
    author: "Lucas M",
    date: "6 months ago",
    rating: 4,
    content:
      "Great men's haircut. The stylist took the time to understand exactly what I wanted and delivered.",
  },
  {
    id: "26",
    author: "Ava P",
    date: "6 months ago",
    rating: 5,
    content:
      "The keratin treatment transformed my hair! It's so much more manageable now and looks incredibly healthy.",
  },
  {
    id: "27",
    author: "Noah C",
    date: "6 months ago",
    rating: 3,
    content:
      "The haircut was fine but nothing special. The salon is clean and well-maintained though.",
  },
  {
    id: "28",
    author: "Ella B",
    date: "7 months ago",
    rating: 5,
    content:
      "The eyebrow threading was perfect! The shape really complements my face and the service was quick and painless.",
  },
  {
    id: "29",
    author: "Mason R",
    date: "7 months ago",
    rating: 4,
    content:
      "Good beard trim and styling. The barber gave me some great tips for maintaining it at home too.",
  },
  {
    id: "30",
    author: "Chloe D",
    date: "7 months ago",
    rating: 5,
    content:
      "The balayage looks incredible! Worth every penny. The stylist was so talented and really listened to what I wanted.",
  },
];

// 샘플 구매 옵션 데이터
export const sampleBuyOptions = [
  {
    id: "1",
    title: "Memberships",
    description: "Buy a bundle of appointments.",
  },
  {
    id: "2",
    title: "Gift Cards",
    description: "Treat yourself or a friend to future visits.",
  },
  {
    id: "3",
    title: "Premium Package",
    description: "Full day of beauty treatments at a special price.",
  },
];

// 샘플 소개 텍스트
export const sampleAbout =
  "Discover HAEYOOM, your premier destination for beauty and relaxation in Sydney. Located at SHOP 6.11, SHEPHERDS BAY PLAZA, 11A BAY DRIVE, MEADOWBANK NSW 2114, we are the No.1 Sydney Hair Salon. Our philosophy 'Beautiful thoughts, HAEYOOM' reflects our commitment to bringing your beauty vision to life. We specialize in expert hair styling, coloring, and treatments, offering tailored services to enhance your natural beauty. Come by and prepare to be dazzled by the exceptional service and welcoming ambiance of HAEYOOM Sydney Hair Salon.";

// 프로모션 데이터
export const promotionData = {
  // 슬라이드로 보여질 이미지들
  slides: [
    {
      id: "promo1",
      image: "/images/promotion/promotion1.png",
      title: "May Promotion - Hair Designers' Exclusive Deals",
    },
    {
      id: "promo2",
      image: "/images/promotion/promotion2.png",
      title: "Special Discount for New Customers",
    },
    {
      id: "promo3",
      image: "/images/promotion/promotion3.png",
      title: "Weekend Package Deal",
    },
    {
      id: "promo4",
      image: "/images/promotion/promotion4.png",
      title: "Seasonal Color Treatment Special",
    },
    {
      id: "promo5",
      image: "/images/promotion/promotion5.png",
      title: "Premium Hair Care Package",
    },
  ],

  // 공통 메시지
  commonMessage: `
    🎉 May Weekday Promotion - Hair Designers' Exclusive Deals
    Individual promotions by each hair designer!

    📌 Each designer offers different deals for different treatments
    Refer to their tagged Instagram for details!

    👉 Swipe left to check each designer's promotion banner!
    👉 Visit each designer's Instagram page for detailed info!
    👉 Choose the promotion or designer that suits you best!

    ⚠️ Please Note: You MUST select the designer when booking to receive their promotion
    -Weekdays only

    Hairdressers:
    1. @hae.artstylist Sue
    2. @hae.bora Bora
    3. @hae.young Yeojung
    4. @hae.chocho Jono
    5. @hae_yerim Yerim
    6. @hae.hiro Hiro

    Booking: via DM or call/text 0432 328 002
  `,
};

// 샘플 서비스 카테고리 데이터
export const sampleServiceCategories = [
  { id: "featured", name: "Featured" },
  { id: "man-cut", name: "Man-cut" },
  { id: "man-perm", name: "Man-Perm" },
  { id: "girl-cut", name: "Girl-cut" },
  { id: "girl-perm", name: "Girl-Perm" },
  { id: "color", name: "Hair Colour | Tint" },
  { id: "cleanse", name: "Cleanse & Style" },
];

// 샘플 서비스 데이터
export const sampleServices = [
  {
    id: "1",
    name: "Cleanse & Style",
    duration: "45 mins",
    price: "SGD 56",
    category: "cleanse",
  },
  {
    id: "2",
    name: "AROMATHÉRAPIE Pedicure",
    duration: "1 hr",
    price: "SGD 52",
    category: "featured",
    femaleOnly: true,
  },
  {
    id: "3",
    name: "Men's Haircut",
    duration: "30 mins",
    price: "SGD 45",
    category: "man-cut",
  },
  {
    id: "4",
    name: "Men's Perm",
    duration: "2 hrs",
    price: "SGD 120",
    category: "man-perm",
  },
  {
    id: "5",
    name: "Women's Haircut",
    duration: "45 mins",
    price: "SGD 65",
    category: "girl-cut",
  },
  {
    id: "6",
    name: "Women's Perm",
    duration: "3 hrs",
    price: "SGD 180",
    category: "girl-perm",
  },
  {
    id: "7",
    name: "Hair Coloring - Full",
    duration: "2 hrs",
    price: "SGD 150",
    category: "color",
  },
  {
    id: "8",
    name: "All-in-One Hair Package",
    duration: "4 hrs",
    price: "SGD 250",
    category: "featured",
    description: "Includes cut, color, and styling",
  },
];
