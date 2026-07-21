import { courses } from './data.js';
import { createProductCardHTML } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.getElementById('product-grid');

  if (productContainer) {
    productContainer.innerHTML = courses.map(course => createProductCardHTML(course)).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }

    productContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-add-cart');
      if (btn) {
        const courseId = btn.getAttribute('data-id');
        const selectedCourse = courses.find(c => c.id == courseId);
        alert(`Đã thêm "${selectedCourse.title}" vào giỏ hàng!`);
      }
    });
  }
});