// --- КУЛЬМИНАЦИЯ: МАКСИМАЛЬНЫЙ ФУНКЦИОНАЛ ---
const TG_BOT_TOKEN = '8013834057:AAFgJAmnPutdMRe1p-EVEfvH4RUxlsfy_jM';
const TG_CHAT_ID = '5415190532';

const PRODUCTS = [
    { id: 1, cat: 'Gadgets', name: 'Vision Pro Max', price: 349000, desc: 'Гарнитура смешанной реальности нового поколения. 4K OLED дисплеи и управление жестами.', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800' },
    { id: 2, cat: 'Audio', name: 'Phantom Speaker', price: 125000, desc: 'Акустическая система с мощностью 1100 Вт и нулевым искажением звука.', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800' },
    { id: 3, cat: 'Gadgets', name: 'Cyber Desk R1', price: 45000, desc: 'Умный стол с беспроводной зарядкой по всей поверхности и RGB подсветкой.', img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800' },
    { id: 4, cat: 'Wear', name: 'Kevlar Jacket', price: 28000, desc: 'Куртка из баллистического нейлона. Легкая, прочная, водонепроницаемая.', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800' },
    { id: 5, cat: 'Audio', name: 'Studio Pods Black', price: 12000, desc: 'Студийный звук в компактном корпусе. Активное шумоподавление 45дБ.', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' }
];

let cart = JSON.parse(localStorage.getItem('ultra_cart')) || [];

// 1. РЕНДЕР КАТАЛОГА
function render(items = PRODUCTS) {
    const container = document.getElementById('catalog');
    if (!container) return;
    
    container.innerHTML = items.map(p => `
        <div class="product-card group relative bg-[#111] rounded-[32px] p-4 border border-white/5 shadow-2xl">
            <div onclick="openProduct(${p.id})" class="cursor-pointer overflow-hidden rounded-[24px] mb-5 h-64 bg-black">
                <img src="${p.img}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
            </div>
            <div class="px-2">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <p class="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-1">${p.cat}</p>
                        <h3 class="font-bold text-lg text-white">${p.name}</h3>
                    </div>
                </div>
                <div class="flex justify-between items-center mt-6">
                    <span class="text-xl font-black text-white">${p.price.toLocaleString()} ₽</span>
                    <button onclick="addToCart(${p.id})" class="bg-white text-black w-12 h-12 rounded-2xl hover:bg-indigo-600 hover:text-white transition flex items-center justify-center shadow-lg">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 2. МОДАЛЬНОЕ ОКНО ТОВАРА
function openProduct(id) {
    const p = PRODUCTS.find(x => x.id === id);
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-category').innerText = p.cat;
    document.getElementById('modal-desc').innerText = p.desc;
    document.getElementById('modal-price').innerText = p.price.toLocaleString() + ' ₽';
    document.getElementById('modal-img').style.backgroundImage = `url(${p.img})`;
    document.getElementById('modal-add-btn').onclick = () => { addToCart(p.id); closeProductModal(); };
    
    document.getElementById('product-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 3. ЛОГИКА КОРЗИНЫ
function addToCart(id) {
    const p = PRODUCTS.find(x => x.id === id);
    const inCart = cart.find(x => x.id === id);
    if(inCart) inCart.count++;
    else cart.push({...p, count: 1});
    
    // Анимация уведомления (если есть элемент toast)
    const toast = document.getElementById('toast');
    if(toast) {
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 2000);
    }
    
    updateUI();
}

function updateUI() {
    localStorage.setItem('ultra_cart', JSON.stringify(cart));
    const list = document.getElementById('cart-items');
    const total = cart.reduce((s, i) => s + i.price * i.count, 0);
    
    const totalEl = document.getElementById('cart-total-price');
    const navTotalEl = document.getElementById('cart-total-price-nav');
    
    if(totalEl) totalEl.innerText = total.toLocaleString() + ' ₽';
    if(navTotalEl) navTotalEl.innerText = total.toLocaleString() + ' ₽';

    if(list) {
        list.innerHTML = cart.map(item => `
            <div class="flex gap-4 bg-white/5 p-4 rounded-2xl items-center border border-white/5">
                <img src="${item.img}" class="w-16 h-16 rounded-xl object-cover">
                <div class="flex-grow">
                    <h4 class="font-bold text-sm text-white">${item.name}</h4>
                    <div class="flex items-center gap-3 mt-2">
                        <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 bg-white/10 rounded-lg hover:bg-white/20 transition">-</button>
                        <span class="text-sm font-bold">${item.count}</span>
                        <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 bg-white/10 rounded-lg hover:bg-white/20 transition">+</button>
                    </div>
                </div>
                <span class="font-bold text-sm text-indigo-400">${(item.price * item.count).toLocaleString()} ₽</span>
            </div>
        `).join('');
    }
}

function changeQty(id, delta) {
    const item = cart.find(x => x.id === id);
    if(item) {
        item.count += delta;
        if(item.count <= 0) cart = cart.filter(x => x.id !== id);
    }
    updateUI();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('sidebar-active');
}

// 4. ПОИСК
function search() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
    render(filtered);
}

// 5. ОФОРМЛЕНИЕ ЗАКАЗА (ОТПРАВКА В TELEGRAM)
async function checkout() {
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    
    if(!name || !phone || cart.length === 0) {
        alert('Пожалуйста, заполните форму и добавьте товары в корзину');
        return;
    }

    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = 'ОТПРАВКА...';
    btn.disabled = true;

    let orderList = cart.map(i => `▫️ ${i.name} (x${i.count}) — ${i.price * i.count} ₽`).join('%0A');
    const total = cart.reduce((s, i) => s + i.price * i.count, 0);

    let msg = `🔥 **НОВЫЙ ЗАКАЗ — ULTRA S**%0A%0A`;
    msg += `👤 Клиент: ${name}%0A📞 Тел: ${phone}%0A%0A`;
    msg += `🛍 Состав заказа:%0A${orderList}%0A%0A`;
    msg += `💰 **ИТОГО: ${total.toLocaleString()} ₽**`;

    const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${msg}&parse_mode=Markdown`;

    try {
        const res = await fetch(url);
        if(res.ok) {
            alert('Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.');
            cart = [];
            updateUI();
            toggleCart();
        } else {
            alert('Ошибка при отправке в Telegram. Проверьте настройки бота.');
        }
    } catch(e) {
        alert('Произошла ошибка сети. Попробуйте еще раз.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// ЗАПУСК ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка для красоты (имитация загрузки данных)
    setTimeout(() => {
        render();
        updateUI();
    }, 800);
});
