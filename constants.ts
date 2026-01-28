
export const SYSTEM_INSTRUCTION = `Bạn là "Khe Sanh Super AI" - chuyên gia du lịch ảo cao cấp nhất về thị trấn Khe Sanh và các vùng lân cận tại Quảng Trị. 

NHIỆM VỤ CỦA BẠN:
1. Cung cấp thông tin chính xác về các địa danh tại Khe Sanh: Di tích Sân bay Tà Cơn, Lao Bảo, Hướng Phùng, Đèo Sa Mù, Thác Tà Puồng...
2. Hỗ trợ lập lịch trình cá nhân hóa (tour 1 ngày, 2 ngày khám phá Khe Sanh, tour trekking, tour tâm linh).
3. Tư vấn ẩm thực: Chỉ ra các quán ngon thực tế (ví dụ: bún chả cá khu vực chợ Khe Sanh, gà nướng vùng cao).
4. Cập nhật thời tiết và cảnh báo an toàn cho khách phượt (đường đèo sương mù, trơn trượt quanh Khe Sanh).
5. Sử dụng Google Search Grounding để cập nhật các homestay mới, sự kiện lễ hội đang diễn ra năm 2024-2025 tại Khe Sanh.

QUY TẮC PHẢN HỒI:
- Luôn thân thiện, chuyên nghiệp như một người bản địa am hiểu Khe Sanh.
- Sử dụng Markdown để trình bày (in đậm các địa danh, sử dụng danh sách gạch đầu dòng).
- Nếu thông tin có liên kết từ Google Search, hãy nhắc người dùng xem "Nguồn tham khảo" ở bên dưới.
- Nếu người dùng hỏi về đặt phòng/xe tại Khe Sanh, hãy cung cấp các tiêu chí lựa chọn và gợi ý tra cứu thực tế.`;

export const FAMOUS_PLACES = [
  { 
    name: 'Di tích Sân bay Tà Cơn', 
    category: 'LỊCH SỬ', 
    image: 'https://tse1.mm.bing.net/th/id/OIP.eq-GTxn_uzTDHEpsbCxlwQHaFj?rs=1&pid=ImgDetMain&o=7&rm=3', 
    desc: 'Bảo tàng ngoài trời lưu giữ các chứng tích chiến tranh hùng hồn ngay tại Khe Sanh.',
    location: 'Khe Sanh, Quảng Trị',
    lat: 16.6525,
    lng: 106.7112
  },
  { 
    name: 'Thác Tà Puồng', 
    category: 'KHÁM PHÁ', 
    image: 'https://cdnen.thesaigontimes.vn/wp-content/uploads/2023/06/Thac-Ta-Puong-2.jpg', 
    desc: 'Hệ thống thác nước tuyệt đẹp với làn nước xanh ngọc bích cách trung tâm Khe Sanh không xa.',
    location: 'Vùng lân cận Khe Sanh',
    lat: 16.8546,
    lng: 106.5819
  },
  { 
    name: 'Đèo Sa Mù', 
    category: 'SĂN MÂY', 
    image: 'https://th.bing.com/th/id/R.d59a20f94b3722e3552df959ecf5991a?rik=HmExH2Hk9UCg2Q&pid=ImgRaw&r=0', 
    desc: 'Cung đường đèo huyền thoại trên tuyến Hồ Chí Minh Tây, nơi săn mây lý tưởng cho khách du lịch Khe Sanh.',
    location: 'Tuyến Hồ Chí Minh Tây',
    lat: 16.7911,
    lng: 106.5829
  },
  { 
    name: 'Cửa khẩu Lao Bảo', 
    category: 'THAM QUAN', 
    image: 'https://th.bing.com/th/id/R.c5e6191e1cd856a384b97d2c993ee19e?rik=1ZhK1z243VAAEA&riu=http%3a%2f%2fmedia.dulich24.com.vn%2fdiemden%2fcua-khau-lao-bao-6402%2fcua-khau-lao-bao-7.jpg&ehk=B31PGRsQhrHTPmMj6uIbtnnN7o2aSDrbX4pg8xMURFc%3d&risl=&pid=ImgRaw&r=0', 
    desc: 'Khu kinh tế cửa khẩu sầm uất, điểm check-in không thể bỏ qua khi tới Khe Sanh.',
    location: 'Thị trấn Lao Bảo',
    lat: 16.6167,
    lng: 106.5833
  },
  { 
    name: 'Hồ Rào Quán', 
    category: 'THƯ GIÃN', 
    image: 'https://cdn.24h.com.vn/upload/2-2021/images/2021-06-29/1624934837-long-ho-rao-quan-nhin-tu-dinh-cu-vo-anh-visit-quang-tri-1394-3918-width645height484.jpg', 
    desc: 'Lòng hồ thủy điện xanh ngắt, điểm dã ngoại tuyệt vời gần Khe Sanh.',
    location: 'Gần thị trấn Khe Sanh',
    lat: 16.6385,
    lng: 106.6972
  }
];

export const FAMOUS_DISHES = [
  {
    name: 'Bún Chả Cá Khe Sanh',
    image: 'https://i.ytimg.com/vi/D95V3tP_MGA/maxresdefault.jpg',
    desc: 'Đặc sản ăn sáng số 1 tại thị trấn, chả cá ngọt lịm cùng nước dùng đậm đà.'
  },
  {
    name: 'Thịt Lợn Bản Gác Bếp',
    image: 'https://th.bing.com/th/id/R.a5ba8fa4bad6a0020b565dc646ac033b?rik=%2fD3wdJXOPvcWvQ&pid=ImgRaw&r=0',
    desc: 'Món nhậu đặc trưng vùng cao Khe Sanh, thơm mùi khói và gia vị bản địa.'
  },
  {
    name: 'Cà phê Arabica Khe Sanh',
    image: 'https://tse2.mm.bing.net/th/id/OIP.YuNIwVyWGEYzvcMOz-H1rQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
    desc: 'Sản vật Khe Sanh đạt chuẩn quốc tế, vị chua thanh và hương thơm nồng nàn.'
  }
];

export const AI_UTILITIES = [
  {
    title: "Trang phục phù hợp",
    icon: "🧥",
    query: "Thời tiết Khe Sanh hôm nay cần mặc đồ như thế nào?"
  },
  {
    title: "Tìm quán ăn ngon",
    icon: "🍲",
    query: "Gợi ý 5 địa chỉ quán ăn ngon nhất ngay tại thị trấn Khe Sanh"
  },
  {
    title: "Lịch trình 2 ngày",
    icon: "🗺️",
    query: "Lập lịch trình du lịch Khe Sanh 2 ngày 1 đêm chi tiết"
  },
  {
    title: "Lưu ý đường đi",
    icon: "🚜",
    query: "Đường từ Khe Sanh đi săn mây Đèo Sa Mù có khó không?"
  }
];

export const NAV_LINKS = [
  { name: "TRANG CHỦ", id: "home" },
  { name: "ĐIỂM ĐẾN", id: "destinations" },
  { name: "ẨM THỰC", id: "cuisine" },
  { name: "BẢN ĐỒ", id: "map" }
];

export const CHAT_SUGGESTIONS = [
  "Homestay đẹp ở Khe Sanh",
  "Cách đi săn mây Đỉnh Cu Vơ",
  "Mua quà gì ở Khe Sanh?",
  "Địa chỉ thuê xe máy uy tín"
];
