/*****************************************************************
 * course.js
 * ---------------------------------------------------------------
 * Quản lý khóa học: Thêm / Sửa / Xóa / Tìm kiếm + LocalStorage
 *****************************************************************/

import { courses } from "../../js/data.js";

const STORAGE_KEY = "ai_training_courses";

let editId = null;

const modal = new bootstrap.Modal(document.getElementById("courseModal"));
const courseTableBody = document.getElementById("courseTableBody");

const txtTitle = document.getElementById("title");
const txtPrice = document.getElementById("price");
const txtCategory = document.getElementById("category");
const txtImage = document.getElementById("image");
const txtDescription = document.getElementById("description");
const imgPreview = document.getElementById("imgPreview");

const btnAdd = document.getElementById("btnAdd");
const btnSave = document.getElementById("btnSave");
const txtSearch = document.getElementById("txtSearch");

/* ===========================================================
   LOCAL STORAGE
=========================================================== */

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        saveToLocalStorage();
        return;
    }

    const localCourses = JSON.parse(data);
    courses.length = 0;
    courses.push(...localCourses);
}

/* ===========================================================
   FORMAT GIÁ
=========================================================== */

function formatPrice(price) {
    return price.toLocaleString("vi-VN") + " đ";
}

/* ===========================================================
   RENDER
=========================================================== */

function renderRow(course) {
    return `
    <tr>
        <td>${course.id}</td>
        <td><img src="${course.image}" class="blog-image"></td>
        <td>${course.title}</td>
        <td>${formatPrice(course.price)}</td>
        <td>${course.category}</td>
        <td>
            <button class="btn btn-warning btn-sm btn-edit" data-id="${course.id}">Sửa</button>
            <button class="btn btn-danger btn-sm btn-delete" data-id="${course.id}">Xóa</button>
        </td>
    </tr>
    `;
}

function renderCourses(list = courses) {
    courseTableBody.innerHTML = "";
    list.forEach((course) => {
        courseTableBody.innerHTML += renderRow(course);
    });
}

/* ===========================================================
   HELPERS
=========================================================== */

function findCourseById(id) {
    return courses.find((c) => c.id == id);
}

function generateId() {
    if (courses.length === 0) return 1;
    return Math.max(...courses.map((c) => c.id)) + 1;
}

function clearForm() {
    txtTitle.value = "";
    txtPrice.value = "";
    txtCategory.value = "";
    txtImage.value = "";
    txtDescription.value = "";
    imgPreview.src = "https://placehold.co/900x400?text=Preview";
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
    const title = txtTitle.value.trim();
    const price = Number(txtPrice.value);
    const category = txtCategory.value.trim();
    const image = txtImage.value.trim();
    const description = txtDescription.value.trim();

    if (title === "") {
        alert("Vui lòng nhập tên khóa học.");
        txtTitle.focus();
        return;
    }

    if (!price || price <= 0) {
        alert("Vui lòng nhập giá hợp lệ.");
        txtPrice.focus();
        return;
    }

    if (category === "") {
        alert("Vui lòng nhập danh mục.");
        txtCategory.focus();
        return;
    }

    if (image === "") {
        alert("Vui lòng nhập link ảnh.");
        txtImage.focus();
        return;
    }

    if (editId === null) {
        courses.push({
            id: generateId(),
            title,
            price,
            category,
            image,
            description
        });
        alert("Thêm khóa học thành công!");
    } else {
        const course = findCourseById(editId);
        if (course) {
            course.title = title;
            course.price = price;
            course.category = category;
            course.image = image;
            course.description = description;
        }
        alert("Cập nhật khóa học thành công!");
    }

    modal.hide();
    clearForm();
    saveToLocalStorage();
    renderCourses();
    editId = null;
});

/* ===========================================================
   SỬA / XÓA (Event Delegation)
=========================================================== */

courseTableBody.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.classList.contains("btn-edit")) {
        openEditModal(id);
    }

    if (button.classList.contains("btn-delete")) {
        deleteCourse(id);
    }
});

function openEditModal(id) {
    const course = findCourseById(id);
    if (!course) return;

    editId = id;

    txtTitle.value = course.title;
    txtPrice.value = course.price;
    txtCategory.value = course.category;
    txtImage.value = course.image;
    txtDescription.value = course.description || "";
    imgPreview.src = course.image;

    modal.show();
}

function deleteCourse(id) {
    const index = courses.findIndex((c) => c.id == id);
    if (index === -1) return;

    const confirmDelete = confirm("Bạn có chắc muốn xóa khóa học này?");
    if (!confirmDelete) return;

    courses.splice(index, 1);
    saveToLocalStorage();
    renderCourses();
}

/* ===========================================================
   XEM TRƯỚC ẢNH
=========================================================== */

txtImage.addEventListener("keyup", () => {
    imgPreview.src = txtImage.value;
});

/* ===========================================================
   TÌM KIẾM
=========================================================== */

txtSearch.addEventListener("keyup", () => {
    const keyword = txtSearch.value.toLowerCase().trim();

    const filtered = courses.filter((c) =>
        c.title.toLowerCase().includes(keyword)
    );

    renderCourses(filtered);
});

/* ===========================================================
   KHỞI TẠO
=========================================================== */

loadFromLocalStorage();
renderCourses();
