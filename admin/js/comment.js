/*****************************************************************
 * comment.js
 * ---------------------------------------------------------------
 * Quản lý bình luận Blog:
 * 1. Hiển thị danh sách
 * 2. Duyệt bình luận (pending -> approved)
 * 3. Xóa bình luận
 * 4. Tìm kiếm + lọc theo trạng thái
 * 5. Lưu vào LocalStorage
 *****************************************************************/

import { comments } from "../../js/data.js";

const STORAGE_KEY = "ai_training_comments";

const commentTableBody = document.getElementById("commentTableBody");
const txtSearch = document.getElementById("txtSearch");
const filterStatus = document.getElementById("filterStatus");

/* ===========================================================
   LOCAL STORAGE
=========================================================== */

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        saveToLocalStorage();
        return;
    }

    const localComments = JSON.parse(data);
    comments.length = 0;
    comments.push(...localComments);
}

/* ===========================================================
   RENDER
=========================================================== */

function statusBadge(status) {
    return status === "approved"
        ? `<span class="badge bg-success">Đã duyệt</span>`
        : `<span class="badge bg-warning">Chờ duyệt</span>`;
}

function renderRow(comment) {
    return `
    <tr>
        <td>${comment.id}</td>
        <td>${comment.blogTitle}</td>
        <td>${comment.author}</td>
        <td>${comment.content}</td>
        <td>${comment.createdAt}</td>
        <td>${statusBadge(comment.status)}</td>
        <td>
            ${
                comment.status === "pending"
                    ? `<button class="btn btn-primary btn-sm btn-approve" data-id="${comment.id}">Duyệt</button>`
                    : ""
            }
            <button class="btn btn-danger btn-sm btn-delete" data-id="${comment.id}">Xóa</button>
        </td>
    </tr>
    `;
}

function getFilteredList() {
    const keyword = txtSearch.value.toLowerCase().trim();
    const status = filterStatus.value;

    return comments.filter((c) => {
        const matchKeyword =
            c.content.toLowerCase().includes(keyword) ||
            c.author.toLowerCase().includes(keyword);

        const matchStatus = status === "all" || c.status === status;

        return matchKeyword && matchStatus;
    });
}

function renderComments() {
    const list = getFilteredList();

    commentTableBody.innerHTML = "";

    if (list.length === 0) {
        commentTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center text-muted py-4">
                Không có bình luận nào.
            </td>
        </tr>
        `;
        return;
    }

    list.forEach((comment) => {
        commentTableBody.innerHTML += renderRow(comment);
    });
}

/* ===========================================================
   DUYỆT / XÓA (Event Delegation)
=========================================================== */

commentTableBody.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.classList.contains("btn-approve")) {
        approveComment(id);
    }

    if (button.classList.contains("btn-delete")) {
        deleteComment(id);
    }
});

function approveComment(id) {
    const comment = comments.find((c) => c.id == id);
    if (!comment) return;

    comment.status = "approved";
    saveToLocalStorage();
    renderComments();
}

function deleteComment(id) {
    const index = comments.findIndex((c) => c.id == id);
    if (index === -1) return;

    const confirmDelete = confirm("Bạn có chắc muốn xóa bình luận này?");
    if (!confirmDelete) return;

    comments.splice(index, 1);
    saveToLocalStorage();
    renderComments();
}

/* ===========================================================
   TÌM KIẾM + LỌC
=========================================================== */

txtSearch.addEventListener("keyup", renderComments);
filterStatus.addEventListener("change", renderComments);

/* ===========================================================
   KHỞI TẠO
=========================================================== */

loadFromLocalStorage();
renderComments();
