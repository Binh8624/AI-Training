/*****************************************************************
 * settings.js
 * ---------------------------------------------------------------
 * 1. Cài đặt chung (tên site, email, sđt) -> LocalStorage
 * 2. Setting QR thanh toán (ngân hàng, chủ TK, số TK, ảnh QR)
 *    -> LocalStorage
 *
 * LƯU Ý: Đây là cấu hình mô phỏng phía Frontend. Với thanh toán
 * thật cần tích hợp cổng thanh toán / API ngân hàng ở Backend.
 *****************************************************************/

const GENERAL_KEY = "ai_training_settings_general";
const QR_KEY = "ai_training_settings_qr";

/* ===========================================================
   CÀI ĐẶT CHUNG
=========================================================== */

const siteName = document.getElementById("siteName");
const siteEmail = document.getElementById("siteEmail");
const sitePhone = document.getElementById("sitePhone");
const btnSaveGeneral = document.getElementById("btnSaveGeneral");

function loadGeneral() {
    const data = localStorage.getItem(GENERAL_KEY);

    const defaults = {
        siteName: "AI Training",
        siteEmail: "contact@aitraining.vn",
        sitePhone: "0900 000 000"
    };

    const settings = data ? JSON.parse(data) : defaults;

    siteName.value = settings.siteName;
    siteEmail.value = settings.siteEmail;
    sitePhone.value = settings.sitePhone;
}

btnSaveGeneral.addEventListener("click", () => {
    if (siteName.value.trim() === "") {
        alert("Vui lòng nhập tên website.");
        siteName.focus();
        return;
    }

    const settings = {
        siteName: siteName.value.trim(),
        siteEmail: siteEmail.value.trim(),
        sitePhone: sitePhone.value.trim()
    };

    localStorage.setItem(GENERAL_KEY, JSON.stringify(settings));
    alert("Đã lưu thông tin website!");
});

/* ===========================================================
   SETTING QR THANH TOÁN
=========================================================== */

const qrBank = document.getElementById("qrBank");
const qrOwner = document.getElementById("qrOwner");
const qrAccount = document.getElementById("qrAccount");
const qrImage = document.getElementById("qrImage");
const qrPreview = document.getElementById("qrPreview");
const btnSaveQr = document.getElementById("btnSaveQr");

function loadQr() {
    const data = localStorage.getItem(QR_KEY);
    if (!data) return;

    const qr = JSON.parse(data);

    qrBank.value = qr.bank || "";
    qrOwner.value = qr.owner || "";
    qrAccount.value = qr.account || "";
    qrImage.value = qr.image || "";

    if (qr.image) {
        qrPreview.src = qr.image;
    }
}

qrImage.addEventListener("keyup", () => {
    qrPreview.src = qrImage.value || "https://placehold.co/220x220?text=QR";
});

btnSaveQr.addEventListener("click", () => {
    if (qrBank.value.trim() === "") {
        alert("Vui lòng nhập tên ngân hàng / ví.");
        qrBank.focus();
        return;
    }

    if (qrAccount.value.trim() === "") {
        alert("Vui lòng nhập số tài khoản.");
        qrAccount.focus();
        return;
    }

    if (qrImage.value.trim() === "") {
        alert("Vui lòng nhập link ảnh QR.");
        qrImage.focus();
        return;
    }

    const qr = {
        bank: qrBank.value.trim(),
        owner: qrOwner.value.trim(),
        account: qrAccount.value.trim(),
        image: qrImage.value.trim()
    };

    localStorage.setItem(QR_KEY, JSON.stringify(qr));
    alert("Đã lưu cấu hình QR thanh toán!");
});

/* ===========================================================
   KHỞI TẠO
=========================================================== */

loadGeneral();
loadQr();
