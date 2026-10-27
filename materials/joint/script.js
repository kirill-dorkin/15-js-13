// Урок 13 · Вместе: корзина MiniShop
// Правило: функции НЕ меняют входные данные. Возвращаем новый массив / объект.

const catalog = [
  { id: 1, name: "Чай", price: 180 },
  { id: 2, name: "Кофе", price: 250 },
  { id: 3, name: "Сок", price: 150 },
];

const cart = [
  { id: 1, name: "Чай", price: 180, qty: 1 },
  { id: 2, name: "Кофе", price: 250, qty: 2 },
];

// 1. Добавить товар в конец корзины с qty: 1
function addToCart(cart, product) {
  // подсказка: [...cart, { ...product, qty: 1 }]
}

// 2. Убрать товар с этим id
function removeFromCart(cart, id) {
  // подсказка: filter
}

// 3. Увеличить qty на 1 у товара с этим id
function increaseQty(cart, id) {
  // подсказка: map + { ...item, qty: ... }, остальные — return item
}

// 4. Новый каталог, где у товара с id новая цена
function changePrice(catalog, id, price) {
}

// 5. Бонус: если товар уже в корзине — qty + 1, иначе добавить
function addOrIncrease(cart, product) {
  // подсказка: some + функции выше
}

// Проверяйте сами:
console.log(addToCart(cart, catalog[2]));
console.log(cart); // должна остаться прежней
