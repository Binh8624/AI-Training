/*****************************************************************
 * blog.js
 * ---------------------------------------------------------------
 * Chức năng:
 * 1. Hiển thị danh sách Blog
 * 2. Mở Modal thêm Blog
 * 3. Đóng Modal
 *
 * (Bài 3.2 sẽ thêm Lưu và Sửa)
 * (Bài 3.3 sẽ thêm Xóa và Tìm kiếm)
 *****************************************************************/

import { blogs } from "../../js/data.js";

/* ===========================================================
   BIẾN TOÀN CỤC
=========================================================== */

/*
 * editId
 * ------------------------------------
 * = null  -> đang thêm mới
 * != null -> đang sửa Blog
 */

let editId = null;


/*
 * Bootstrap Modal
 *
 * Dùng để mở / đóng popup
 */

const modal = new bootstrap.Modal(
    document.getElementById("blogModal")
);


/*
 * tbody của bảng
 */

const blogTableBody =
    document.getElementById("blogTableBody");


/*
 * Các input
 */

const txtTitle =
    document.getElementById("title");

const txtAuthor =
    document.getElementById("author");

const txtImage =
    document.getElementById("image");

const txtContent =
    document.getElementById("content");


/*
 * Button
 */

const btnAdd =
    document.getElementById("btnAdd");

const btnSave =
    document.getElementById("btnSave");


/* ===========================================================
   KHI TRANG ĐƯỢC MỞ
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderBlogs();

});


/* ===========================================================
   HIỂN THỊ DANH SÁCH BLOG
=========================================================== */

/*
 * renderBlogs()
 *
 * Đọc mảng blogs
 *
 * =>
 *
 * Sinh HTML
 *
 * =>
 *
 * Hiển thị lên bảng
 */

function renderBlogs() {

    /*
     * Xóa dữ liệu cũ
     */

    blogTableBody.innerHTML = "";


    /*
     * Duyệt từng Blog
     */

    blogs.forEach((blog) => {

        blogTableBody.innerHTML += `

        <tr>

            <td>${blog.id}</td>

            <td>

                <img
                    src="${blog.image}"
                    class="blog-image">

            </td>

            <td>

                ${blog.title}

            </td>

            <td>

                ${blog.author}

            </td>

            <td>

                ${blog.createdAt}

            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm btn-edit"
                    data-id="${blog.id}">

                    Sửa

                </button>

                <button
                    class="btn btn-danger btn-sm btn-delete"
                    data-id="${blog.id}">

                    Xóa

                </button>

            </td>

        </tr>

        `;

    });

}


/* ===========================================================
   MỞ MODAL THÊM BLOG
=========================================================== */

btnAdd.addEventListener("click", () => {

    clearForm();

    editId = null;

    modal.show();

});


/* ===========================================================
   XÓA DỮ LIỆU FORM
=========================================================== */

function clearForm() {

    txtTitle.value = "";

    txtAuthor.value = "";

    txtImage.value = "";

    txtContent.value = "";

}


/* ===========================================================
   HÀM TÌM BLOG THEO ID
=========================================================== */

function findBlogById(id){

    return blogs.find(blog => blog.id == id);

}


/* ===========================================================
   HÀM TẠO ID MỚI
=========================================================== */

function generateId(){

    if(blogs.length === 0){

        return 1;

    }

    return Math.max(...blogs.map(blog => blog.id)) + 1;

}


/* ===========================================================
   NÚT LƯU BLOG
=========================================================== */

/*
 * Khi bấm nút "Lưu Blog"
 *
 * Nếu editId == null
 *      => Thêm Blog mới
 *
 * Nếu editId != null
 *      => Cập nhật Blog
 */

btnSave.addEventListener("click", () => {

    saveBlog();

});


/* ===========================================================
   HÀM LƯU BLOG
=========================================================== */

function saveBlog(){

    /* ---------------------------
       Lấy dữ liệu từ Form
    ---------------------------- */

    const title = txtTitle.value.trim();

    const author = txtAuthor.value.trim();

    const image = txtImage.value.trim();

    const content = txtContent.value.trim();


    /* ---------------------------
       Validate
    ---------------------------- */

    if(title === ""){

        alert("Vui lòng nhập tiêu đề.");

        txtTitle.focus();

        return;

    }

    if(author === ""){

        alert("Vui lòng nhập tác giả.");

        txtAuthor.focus();

        return;

    }

    if(image === ""){

        alert("Vui lòng nhập link ảnh.");

        txtImage.focus();

        return;

    }

    if(content === ""){

        alert("Vui lòng nhập nội dung.");

        txtContent.focus();

        return;

    }


    /* ---------------------------
       Nếu đang thêm Blog
    ---------------------------- */

    if(editId === null){

        const newBlog = {

            id: generateId(),

            title: title,

            author: author,

            image: image,

            content: content,

            createdAt: new Date().toLocaleDateString("vi-VN")

        };

        blogs.push(newBlog);

        alert("Thêm Blog thành công!");

    }

    /* ---------------------------
       Nếu đang sửa Blog
    ---------------------------- */

    else{

        const blog = findBlogById(editId);

        if(blog){

            blog.title = title;

            blog.author = author;

            blog.image = image;

            blog.content = content;

        }

        alert("Cập nhật Blog thành công!");

    }


    /* ---------------------------
       Đóng Modal
    ---------------------------- */

    modal.hide();


    /* ---------------------------
       Xóa Form
    ---------------------------- */

    clearForm();


    /* ---------------------------
       Lưu xuống LocalStorage
    ---------------------------- */

    saveToLocalStorage();


    /* ---------------------------
       Hiển thị lại bảng
    ---------------------------- */

    renderBlogs();


    /* ---------------------------
       Reset editId
    ---------------------------- */

    editId = null;

}



/* ===========================================================
   SỰ KIỆN CLICK TRÊN BẢNG
=========================================================== */

/*
 * Vì nút Sửa được tạo bằng JavaScript
 *
 * nên dùng Event Delegation
 */

blogTableBody.addEventListener("click",(e)=>{

    /*
     * Tìm nút gần nhất
     */

    const button = e.target.closest("button");

    if(!button){

        return;

    }

    /*
     * Lấy id Blog
     */

    const id = Number(button.dataset.id);


    /*
     * Nếu là nút Sửa
     */

    if(button.classList.contains("btn-edit")){

        openEditModal(id);

    }

});


/* ===========================================================
   MỞ MODAL SỬA BLOG
=========================================================== */

function openEditModal(id){

    /*
     * Tìm Blog theo id
     */

    const blog = findBlogById(id);

    if(!blog){

        return;

    }

    /*
     * Đánh dấu đang sửa
     */

    editId = id;


    /*
     * Đổ dữ liệu lên Form
     */

    txtTitle.value = blog.title;

    txtAuthor.value = blog.author;

    txtImage.value = blog.image;

    txtContent.value = blog.content;


    /*
     * Mở Modal
     */

    modal.show();

}

/* ===========================================================
   LOCAL STORAGE
=========================================================== */

/*
 * Key dùng để lưu dữ liệu Blog
 */
const STORAGE_KEY = "ai_training_blogs";

/*
 * Lưu dữ liệu xuống LocalStorage
 */
function saveToLocalStorage() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(blogs)
    );

}

/*
 * Đọc dữ liệu từ LocalStorage
 */
function loadFromLocalStorage() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {

        saveToLocalStorage();

        return;

    }

    const localBlogs = JSON.parse(data);

    blogs.length = 0;

    blogs.push(...localBlogs);

}

/*
 * Khi mở trang
 * Đọc dữ liệu trước
 */
loadFromLocalStorage();

renderBlogs();



/* ===========================================================
   XÓA BLOG
=========================================================== */

function deleteBlog(id){

    const index = blogs.findIndex(blog => blog.id == id);

    if(index === -1){

        return;

    }

    const confirmDelete = confirm(
        "Bạn có chắc muốn xóa Blog này?"
    );

    if(!confirmDelete){

        return;

    }

    blogs.splice(index,1);

    saveToLocalStorage();

    renderBlogs();

}



/* ===========================================================
   BẮT SỰ KIỆN NÚT XÓA
=========================================================== */

blogTableBody.addEventListener("click",(e)=>{

    const button = e.target.closest("button");

    if(!button){

        return;

    }

    const id = Number(button.dataset.id);

    if(button.classList.contains("btn-delete")){

        deleteBlog(id);

    }

});



/* ===========================================================
   TÌM KIẾM BLOG
=========================================================== */

const txtSearch =
document.getElementById("txtSearch");

txtSearch.addEventListener("keyup",()=>{

    searchBlog();

});



function searchBlog(){

    const keyword =
    txtSearch.value.toLowerCase().trim();

    blogTableBody.innerHTML="";

    blogs

    .filter(blog=>{

        return blog.title
        .toLowerCase()
        .includes(keyword)

        ||

        blog.author
        .toLowerCase()
        .includes(keyword);

    })

    .forEach(blog=>{

        blogTableBody.innerHTML += `

        <tr>

            <td>${blog.id}</td>

            <td>

                <img

                src="${blog.image}"

                class="blog-image">

            </td>

            <td>${blog.title}</td>

            <td>${blog.author}</td>

            <td>${blog.createdAt}</td>

            <td>

                <button

                    class="btn btn-warning btn-sm btn-edit"

                    data-id="${blog.id}">

                    Sửa

                </button>

                <button

                    class="btn btn-danger btn-sm btn-delete"

                    data-id="${blog.id}">

                    Xóa

                </button>

            </td>

        </tr>

        `;

    });

}



/* ===========================================================
   XEM TRƯỚC ẢNH
=========================================================== */

/*
 * Nếu blogs.html chưa có imgPreview
 * thì thêm:
 *
 * <img id="imgPreview">
 */

const txtImageInput =
document.getElementById("image");

const imgPreview =
document.getElementById("imgPreview");

if(imgPreview){

    txtImageInput.addEventListener("keyup",()=>{

        imgPreview.src = txtImageInput.value;

    });

}



