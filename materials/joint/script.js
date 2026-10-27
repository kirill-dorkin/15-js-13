// ═══════════════════════════════════════════════
//  JS 13 · Практика вместе: корзина
//  Результат смотрим в консоли: F12 → Console.
//  Правило: старую корзину НЕ меняем, возвращаем НОВУЮ.
// ═══════════════════════════════════════════════

const cart = [
  { id: 1, name: "Чай", qty: 1 },
  { id: 2, name: "Кофе", qty: 2 },
];

const juice = { id: 3, name: "Сок", qty: 1 };

// Помощник для консоли: корзина → ["Чай ×1", "Кофе ×2"]
function show(list) {
  if (list === undefined) {
    return "undefined — функция ничего не вернула (нет return)";
  }
  return list.map((item) => (item === undefined ? "undefined" : item.name + " ×" + item.qty));
}


// ── 0. Разминка: ссылка или копия?
// Сначала скажите ответ вслух, потом обновите страницу.
const sameCart = cart;
const copyCart = [...cart];
console.log("0. sameCart === cart:", sameCart === cart); // ?
console.log("0. copyCart === cart:", copyCart === cart); // ?


// ── 1. Добавить товар
// addToCart(cart, product) возвращает новый массив: все товары + product в конце.
function addToCart(cart, product) {

}

const cart1 = addToCart(cart, juice);
console.log("1. Новая: ", show(cart1)); // Ожидается: ["Чай ×1", "Кофе ×2", "Сок ×1"]
console.log("1. Старая:", show(cart));  // Ожидается: ["Чай ×1", "Кофе ×2"]


// ── 2. Удалить товар
// removeFromCart(cart, id) возвращает новый массив без товара с этим id.
function removeFromCart(cart, id) {

}

const cart2 = removeFromCart(cart, 2);
console.log("2. Новая: ", show(cart2)); // Ожидается: ["Чай ×1"]
console.log("2. Старая:", show(cart));  // Ожидается: ["Чай ×1", "Кофе ×2"]


// ── 3. Увеличить количество
// increaseQty(cart, id) возвращает новый массив.
// У товара с этим id — новый объект с qty + 1. Остальные — как есть.
function increaseQty(cart, id) {

}

const cart3 = increaseQty(cart, 2);
console.log("3. Новая: ", show(cart3)); // Ожидается: ["Чай ×1", "Кофе ×3"]
console.log("3. Старая:", show(cart));  // Ожидается: ["Чай ×1", "Кофе ×2"]


// ── 4. Сравнить через ===
// Выведите в консоль три сравнения:
//   cart3 === cart        Ожидается: false (новый массив)
//   cart3[1] === cart[1]  Ожидается: false (Кофе — новый объект)
//   cart3[0] === cart[0]  Ожидается: true  (Чай не меняли — тот же объект)

