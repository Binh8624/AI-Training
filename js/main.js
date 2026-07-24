import { courses as defaultCourses } from './data.js';
import { createProductCardHTML } from './components.js';

const STORAGE_KEY = 'ai_training_courses';

function mergeCourses(localCourses) {
  if (!Array.isArray(localCourses)) {
    return [...defaultCourses];
  }

  const courseMap = new Map();
  defaultCourses.forEach((course) => courseMap.set(course.id, { ...course }));
  localCourses.forEach((course) => {
    if (!course || typeof course.id !== 'number') return;
    courseMap.set(course.id, { ...course });
  });

  return [...courseMap.values()];
}

function loadCourses() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    return defaultCourses;
  }

  try {
    const parsed = JSON.parse(storedData);
    return mergeCourses(parsed);
  } catch (error) {
    return defaultCourses;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.getElementById('product-grid');
  const courses = loadCourses();

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
        if (selectedCourse) {
          alert(`Đã thêm "${selectedCourse.title}" vào giỏ hàng!`);
        }
      }
    });
  }
});