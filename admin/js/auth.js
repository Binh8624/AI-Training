/*****************************************************************
 * auth.js
 * ---------------------------------------------------------------
 * File dùng CHUNG cho mọi trang trong thư mục /admin (trừ login.html).
 *
 * Nhiệm vụ:
 * 1. Bảo vệ trang admin (chưa đăng nhập -> đá về login.html)
 * 2. Lưu / đọc thông tin người đăng nhập (LocalStorage)
 * 3. PHÂN QUYỀN 2 CẤP trong khu vực quản trị:
 *      - "Admin" : toàn quyền (kể cả Người dùng, Cài đặt)
 *      - "Staff" : nhân viên nội bộ, quyền hạn chế
 *                  (không được vào trang Người dùng / Cài đặt)
 * 4. Đăng xuất
 *
 * ⚠️ PHÂN BIỆT QUAN TRỌNG (đọc kỹ trước khi sửa code):
 * -----------------------------------------------------------
 * Trang /admin này là khu vực QUẢN TRỊ NỘI BỘ, chỉ dành cho
 * nhân sự của AI Training (Admin, Staff). Nó KHÔNG dành cho
 * tài khoản của học viên/khách truy cập website (thường được
 * gọi là "User" trong phần quản lý người dùng ở users.html).
 *
 * Vì vậy:
 *   - Tài khoản có role = "Admin" hoặc "Staff"  -> được vào /admin
 *   - Tài khoản có role = "User" (học viên/khách) -> BỊ CHẶN,
 *     không được đăng nhập vào /admin dưới bất kỳ hình thức nào.
 *
 * Đây chính là lỗi ở bản trước: role "User" vẫn lọt được vào
 * dashboard.html vì requireAuth() chỉ kiểm tra "đã đăng nhập
 * hay chưa" mà chưa kiểm tra "có phải nhân sự nội bộ không".
 * Bản này đã bổ sung bước kiểm tra đó (xem ADMIN_PANEL_ROLES).
 *
 * LƯU Ý: Đây là mô phỏng đăng nhập phía Frontend (demo),
 * KHÔNG phải cơ chế bảo mật thật. Khi có Backend cần thay
 * bằng xác thực server (JWT / Session) thật sự — Frontend
 * không bao giờ được coi là lớp bảo mật duy nhất.
 *****************************************************************/

const AUTH_KEY = "ai_training_auth_user";

/*
 * Các vai trò ĐƯỢC PHÉP đăng nhập / truy cập khu vực /admin.
 * Role "User" (học viên, khách truy cập website) KHÔNG có mặt
 * trong danh sách này -> sẽ luôn bị chặn nếu cố vào /admin.
 */
const ADMIN_PANEL_ROLES = ["Admin", "Staff"];

/*
 * Danh sách tài khoản demo dùng để TEST giao diện & phân quyền.
 * (Sau này khi có Backend thật, đăng nhập sẽ gọi API, KHÔNG
 * check cứng trong mảng này nữa)
 */
export const DEMO_ACCOUNTS = [
    // Admin: toàn quyền, thấy hết mọi menu
    { username: "admin", password: "admin123", name: "Bắc", role: "Admin" },

    // Staff: nhân viên nội bộ, KHÔNG thấy menu Người dùng / Cài đặt
    { username: "staff", password: "staff123", name: "Đình Huy", role: "Staff" }
];

/*
 * Lấy user đang đăng nhập (null nếu chưa đăng nhập)
 */
export function getCurrentUser() {
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/*
 * Lưu user đăng nhập vào LocalStorage
 */
export function setCurrentUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

/*
 * Đăng xuất: xóa phiên đăng nhập & quay về trang login
 */
export function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "login.html";
}

/*
 * requireAuth(requireAdmin)
 * ---------------------------------------------------------------
 * Gọi hàm này ở ĐẦU mỗi trang admin (trừ login.html) để bảo vệ trang.
 *
 * Tham số:
 *   requireAdmin (boolean, mặc định false)
 *     - false : trang dùng chung cho cả Admin lẫn Staff
 *               (vd: dashboard, blogs, courses, comments, stats)
 *     - true  : trang CHỈ dành riêng cho Admin
 *               (vd: users.html, settings.html)
 *
 * Thứ tự kiểm tra (3 bước):
 *   1) Chưa đăng nhập                          -> về login.html
 *   2) Đã đăng nhập nhưng role KHÔNG nằm trong
 *      ADMIN_PANEL_ROLES (vd: role "User")      -> chặn hẳn,
 *      tự động đăng xuất vì tài khoản này
 *      không thuộc về khu vực quản trị.
 *   3) requireAdmin=true nhưng role != "Admin"  -> chặn,
 *      đưa về dashboard (vẫn còn quyền vào các trang chung).
 */
export function requireAuth(requireAdmin = false) {
    const user = getCurrentUser();

    // Bước 1: chưa đăng nhập
    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    // Bước 2: đăng nhập rồi nhưng không phải nhân sự nội bộ
    // (vd: tài khoản role "User" của học viên) -> không cho vào /admin
    if (!ADMIN_PANEL_ROLES.includes(user.role)) {
        alert("Tài khoản của bạn không có quyền truy cập trang quản trị.");
        logout();
        return null;
    }

    // Bước 3: trang riêng cho Admin mà user chỉ là Staff
    if (requireAdmin && user.role !== "Admin") {
        alert("Chỉ tài khoản Admin mới có quyền truy cập trang này.");
        window.location.href = "dashboard.html";
        return null;
    }

    return user;
}

/*
 * Hiển thị tên + vai trò của user hiện tại lên topbar (avatar box),
 * đồng thời ẩn các menu có [data-admin-only] nếu user chỉ là Staff.
 *
 * (Những phần tử gắn [data-admin-only] trong HTML là các mục
 * menu/nút chỉ Admin mới nên thấy, ví dụ menu "Người dùng",
 * menu "Cài đặt")
 */
export function renderUserBox(user) {
    const nameEl = document.querySelector("[data-user-name]");
    const roleEl = document.querySelector("[data-user-role]");

    if (nameEl) nameEl.textContent = user.name;

    if (roleEl) {
        roleEl.textContent = user.role === "Admin" ? "Administrator" : "Nhân viên";
    }

    if (user.role !== "Admin") {
        document
            .querySelectorAll("[data-admin-only]")
            .forEach((el) => el.classList.add("d-none"));
    }
}

/*
 * Gắn sự kiện đăng xuất cho mọi phần tử có [data-logout]
 * (thường là link "Đăng xuất" ở cuối sidebar)
 */
export function bindLogout() {
    document.querySelectorAll("[data-logout]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    });
}
