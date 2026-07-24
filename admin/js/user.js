/*****************************************************************
 * user.js
 * ---------------------------------------------------------------
 * Quản lý người dùng:
 * 1. Hiển thị danh sách
 * 2. Thêm / Sửa (kèm phân quyền Admin/User + trạng thái khóa)
 * 3. Xóa
 * 4. Tìm kiếm theo tên / email
 * 5. Lưu vào LocalStorage
 *****************************************************************/

import { users } from "../../js/data.js";

const STORAGE_KEY = "ai_training_users";

let editId = null;

const modal = new bootstrap.Modal(document.getElementById("userModal"));

const userTableBody = document.getElementById("userTableBody");

const txtName = document.getElementById("name");
const txtEmail = document.getElementById("email");
const selectRole = document.getElementById("role");
const selectStatus = document.getElementById("status");

const btnAdd = document.getElementById("btnAdd");
const btnSave = document.getElementById("btnSave");
const txtSearch = document.getElementById("txtSearch");

/* ===========================================================
   LOCAL STORAGE
=========================================================== */

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        saveToLocalStorage();
        return;
    }

    const localUsers = JSON.parse(data);
    users.length = 0;
    users.push(...localUsers);
}

/* ===========================================================
   RENDER
=========================================================== */

function statusBadge(status) {
    return status === "active"
        ? `<span class="badge bg-success">Đang hoạt động</span>`
        : `<span class="badge bg-danger">Đã khóa</span>`;
}

function roleBadge(role) {
    return role === "Admin"
        ? `<span class="badge bg-primary">Admin</span>`
        : `<span class="badge bg-secondary">User</span>`;
}

function renderRow(user) {
    return `
    <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${roleBadge(user.role)}</td>
        <td>${statusBadge(user.status)}</td>
        <td>${user.createdAt}</td>
        <td>
            <button class="btn btn-warning btn-sm btn-edit" data-id="${user.id}">Sửa</button>
            <button class="btn btn-outline-secondary btn-sm btn-toggle" data-id="${user.id}">
                ${user.status === "active" ? "Khóa" : "Mở khóa"}
            </button>
            <button class="btn btn-danger btn-sm btn-delete" data-id="${user.id}">Xóa</button>
        </td>
    </tr>
    `;
}

function renderUsers(list = users) {
    userTableBody.innerHTML = "";
    list.forEach((user) => {
        userTableBody.innerHTML += renderRow(user);
    });
}

/* ===========================================================
   HELPERS
=========================================================== */

function findUserById(id) {
    return users.find((u) => u.id == id);
}

function generateId() {
    if (users.length === 0) return 1;
    return Math.max(...users.map((u) => u.id)) + 1;
}

function clearForm() {
    txtName.value = "";
    txtEmail.value = "";
    selectRole.value = "User";
    selectStatus.value = "active";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ===========================================================
   THÊM
=========================================================== */

btnAdd.addEventListener("click", () => {
    clearForm();
    editId = null;
    modal.show();
});

/* ===========================================================
   LƯU (THÊM / SỬA)
=========================================================== */

btnSave.addEventListener("click", () => {
    const name = txtName.value.trim();
    const email = txtEmail.value.trim();
    const role = selectRole.value;
    const status = selectStatus.value;

    if (name === "") {
        alert("Vui lòng nhập họ tên.");
        txtName.focus();
        return;
    }

    if (email === "" || !isValidEmail(email)) {
        alert("Vui lòng nhập email hợp lệ.");
        txtEmail.focus();
        return;
    }

    // Không cho trùng email với người dùng khác
    const duplicated = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== editId
    );
    if (duplicated) {
        alert("Email này đã được sử dụng bởi người dùng khác.");
        txtEmail.focus();
        return;
    }

    if (editId === null) {
        users.push({
            id: generateId(),
            name,
            email,
            role,
            status,
            createdAt: new Date().toLocaleDateString("vi-VN")
        });
        alert("Thêm người dùng thành công!");
    } else {
        const user = findUserById(editId);
        if (user) {
            user.name = name;
            user.email = email;
            user.role = role;
            user.status = status;
        }
        alert("Cập nhật người dùng thành công!");
    }

    modal.hide();
    clearForm();
    saveToLocalStorage();
    renderUsers();
    editId = null;
});

/* ===========================================================
   SỬA / KHÓA-MỞ / XÓA (Event Delegation)
=========================================================== */

userTableBody.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.classList.contains("btn-edit")) {
        openEditModal(id);
    }

    if (button.classList.contains("btn-toggle")) {
        toggleStatus(id);
    }

    if (button.classList.contains("btn-delete")) {
        deleteUser(id);
    }
});

function openEditModal(id) {
    const user = findUserById(id);
    if (!user) return;

    editId = id;

    txtName.value = user.name;
    txtEmail.value = user.email;
    selectRole.value = user.role;
    selectStatus.value = user.status;

    modal.show();
}

function toggleStatus(id) {
    const user = findUserById(id);
    if (!user) return;

    user.status = user.status === "active" ? "locked" : "active";

    saveToLocalStorage();
    renderUsers();
}

function deleteUser(id) {
    const index = users.findIndex((u) => u.id == id);
    if (index === -1) return;

    const confirmDelete = confirm("Bạn có chắc muốn xóa người dùng này?");
    if (!confirmDelete) return;

    users.splice(index, 1);
    saveToLocalStorage();
    renderUsers();
}

/* ===========================================================
   TÌM KIẾM
=========================================================== */

txtSearch.addEventListener("keyup", () => {
    const keyword = txtSearch.value.toLowerCase().trim();

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(keyword) ||
            u.email.toLowerCase().includes(keyword)
    );

    renderUsers(filtered);
});

/* ===========================================================
   KHỞI TẠO
=========================================================== */

loadFromLocalStorage();
renderUsers();
