export const formatPrice = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
};

export const createProductCardHTML = (course) => {
  return `
    <div class="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div class="relative overflow-hidden aspect-video bg-slate-100">
        <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span class="absolute top-3 left-3 bg-white/95 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          ${course.category}
        </span>
      </div>

      <div class="p-5 flex flex-col flex-grow">
        <a href="product-detail.html?id=${course.id}" class="block mb-2">
          <h3 class="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
            ${course.title}
          </h3>
        </a>
        <p class="text-xs text-slate-500 line-clamp-2 mb-4 flex-grow">
          ${course.description}
        </p>

        <div class="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <div>
            <span class="text-xs text-slate-400 block">Giá bán</span>
            <span class="text-base font-extrabold text-slate-900">${formatPrice(course.price)}</span>
          </div>
          <button 
            data-id="${course.id}" 
            class="btn-add-cart flex items-center justify-center p-2 rounded-xl border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
          >
            <i data-lucide="shopping-cart" class="w-5 h-5 pointer-events-none"></i>
          </button>
        </div>
      </div>
    </div>
  `;
};