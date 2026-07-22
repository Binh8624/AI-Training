export const courses = [
  {
    id: 1,
    title: 'Logic Math — Toán Tư Duy Cơ Bản',
    description: 'Nền tảng toán logic trước khi học lập trình — flowchart, số nhị phân, tập hợp, đại số logic, tổ hợp, xác suất.',
    price: 3500000,
    image: 'https://www.dunglailaptrinh.com/courses/1.jpg',
    category: 'Khóa học'
  },
  {
    id: 2,
    title: 'Python — Cơ Bản Đến Nâng Cao',
    description: 'Hiểu rõ Python từ terminal đến OOP — nền tảng cho AI, Data Science, Web và tự động hóa.',
    price: 1890000,
    image: 'https://www.dunglailaptrinh.com/courses/2.jpg',
    category: 'Khóa học'
  },
  {
    id: 3,
    title: 'Lập Trình Web Cơ Bản',
    description: 'Xây website từ HTML, CSS, JavaScript, PHP đến MySQL — CRUD, GitHub, tên miền, hosting riêng.',
    price: 4200000,
    image: 'https://www.dunglailaptrinh.com/courses/3.jpg',
    category: 'Khóa học'
  },
  {
    id: 4,
    title: 'Lập Trình Game Python',
    description: 'Tư duy thiết kế game, thư viện Pygame — thực hành làm 3 game: Đồng hồ đếm ngược, Flappy Bird, Rắn săn mồi.',
    price: 650000,
    image: 'https://www.dunglailaptrinh.com/courses/4.webp',
    category: 'Khóa học'
  }

  
];

// ==========================================
// Danh sách Blog
// File này chứa dữ liệu mẫu cho website.
//
// Sau này khi có Backend (Spring Boot/API)
// dữ liệu sẽ được lấy từ Database.
// ==========================================

export const blogs = [
  {
    id: 1,
    title: "Giới thiệu ChatGPT",
    author: "Admin",
    image: "https://picsum.photos/300/200?random=1",
    content: "ChatGPT là mô hình AI hỗ trợ tạo nội dung và trả lời câu hỏi.",
    createdAt: "22/07/2026"
  },
  {
    id: 2,
    title: "Claude AI là gì?",
    author: "Admin",
    image: "https://picsum.photos/300/200?random=2",
    content: "Claude AI là mô hình AI do Anthropic phát triển.",
    createdAt: "21/07/2026"
  }
];

// ==========================================
// Danh sách Người dùng
// Mô phỏng dữ liệu user cho phần Quản lý người dùng
// và Phân quyền Admin/User.
// Sau này khi có Backend, dữ liệu sẽ lấy từ Database.
// ==========================================

export const users = [
  {
    id: 1,
    name: "Bắc",
    email: "bac@aitraining.vn",
    role: "Admin",
    status: "active",
    createdAt: "01/01/2026"
  },
  {
    id: 2,
    name: "Hoài Thương",
    email: "ht@aitraining.vn",
    role: "Admin",
    status: "active",
    createdAt: "03/01/2026"
  },
  {
    id: 3,
    name: "Đình Huy",
    email: "dh@aitraining.vn",
    role: "User",
    status: "active",
    createdAt: "15/03/2026"
  },
  {
    id: 4,
    name: "Minh Hằng",
    email: "mh@aitraining.vn",
    role: "User",
    status: "locked",
    createdAt: "20/05/2026"
  }
];

// ==========================================
// Danh sách Bình luận Blog
// ==========================================

export const comments = [
  {
    id: 1,
    blogId: 1,
    blogTitle: "Giới thiệu ChatGPT",
    author: "Minh Khang",
    content: "Bài viết rất hữu ích, cảm ơn admin!",
    createdAt: "22/07/2026",
    status: "approved"
  },
  {
    id: 2,
    blogId: 1,
    blogTitle: "Giới thiệu ChatGPT",
    author: "Thu Trang",
    content: "Mong có thêm bài về prompt engineering.",
    createdAt: "22/07/2026",
    status: "pending"
  },
  {
    id: 3,
    blogId: 2,
    blogTitle: "Claude AI là gì?",
    author: "Văn Phát",
    content: "Claude viết code khá tốt đó.",
    createdAt: "21/07/2026",
    status: "approved"
  }
];