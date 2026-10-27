// ═══════════════════════════════════════════════
//  JS 13 · Практика вместе: магазин и корзина
//  Результат — в консоли: F12 → Console. После сохранения — F5.
//  Правило урока: старую корзину НЕ меняем, а возвращаем НОВУЮ.
// ═══════════════════════════════════════════════

const catalog = [
  { id: 1, name: "Чай", price: 180, inStock: true },
  { id: 2, name: "Кофе", price: 250, inStock: false },
  { id: 3, name: "Сок", price: 120, inStock: true },
  { id: 4, name: "Печенье", price: 90, inStock: true },
];


// ── Разминка · ссылка или копия? (сегодняшняя теория)
// Сначала ответ вслух, потом F5.
const tea = catalog[0];
const teaCopy = { ...tea };
console.log("0.", tea === catalog[0]); // ?
console.log("0.", teaCopy === tea);    // ?
console.log("0.", teaCopy.name === tea.name); // ?


// ── Шаг 1 · найти товар по id
// Повторяем: функции (5), стрелочные (6), find (12)
function findProduct(id) {
  return catalog.find((product) => product.id === id);
}

console.log("1.", findProduct(3));  // Ожидается: объект Сок
console.log("1.", findProduct(99)); // Ожидается: undefined


// ── Шаг 2 · строка для одного товара корзины
// Повторяем: шаблонные строки (7), арифметика (3)
function formatItem(item) {
  return `${item.name} × ${item.qty} = ${item.price * item.qty} сом`;
}

console.log("2.", formatItem({ id: 1, name: "Чай", price: 180, qty: 2 }));
// Ожидается: Чай × 2 = 360 сом


// ── Шаг 3 · показать корзину
// Повторяем: условия (4), length (8), forEach (11)
function printCart(cart) {
  if (cart.length === 0) {
    console.log("   Корзина пуста");
    return;
  }
  cart.forEach((item) => {
    console.log("   " + formatItem(item));
  });
}

console.log("3.");
printCart([]);
printCart([{ id: 3, name: "Сок", price: 120, qty: 3 }]);
// Ожидается: Корзина пуста / Сок × 3 = 360 сом


// ── Шаг 4 · сумма корзины
// Повторяем: цикл for...of (9), += (3)
function getTotal(cart) {
  let total = 0;
  for (const item of cart) {
    total += item.price * item.qty;
  }
  return total;
}

console.log("4.", getTotal([{ id: 1, name: "Чай", price: 180, qty: 2 }, { id: 3, name: "Сок", price: 120, qty: 1 }]));
// Ожидается: 480


// ── Шаг 5 · увеличить количество (НОВОЕ)
// map + spread: нужный товар → новый объект, остальные → как есть
function increaseQty(cart, id) {
  return cart.map((item) =>
    item.id === id ? { ...item, qty: item.qty + 1 } : item
  );
}

const testCart = [{ id: 1, name: "Чай", price: 180, qty: 1 }];
console.log("5. Новая: ", increaseQty(testCart, 1)); // Ожидается: Чай qty 2
console.log("5. Старая:", testCart);                 // Ожидается: Чай qty 1 — не изменилась


// ── Шаг 6 · добавить в корзину (НОВОЕ + всё вместе)
// Повторяем: find (12), условия и ! (4), some (12). Новое: [...cart, новый]
function addToCart(cart, id) {
  const product = findProduct(id);

  if (!product) {
    console.log(`   Товара с id ${id} нет`);
    return cart;
  }
  if (!product.inStock) {
    console.log(`   ${product.name}: нет в наличии`);
    return cart;
  }
  if (cart.some((item) => item.id === id)) {
    return increaseQty(cart, id);
  }
  return [...cart, { ...product, qty: 1 }];
}

console.log("6.", addToCart([], 3)); // Ожидается: [Сок qty 1]
console.log("6.", addToCart([], 2)); // Ожидается: «Кофе: нет в наличии», потом []


// ── Шаг 7 · удалить из корзины (НОВОЕ)
// filter: оставляем всех, кроме удаляемого
function removeFromCart(cart, id) {
  return cart.filter((item) => item.id !== id);
}

console.log("7.", removeFromCart(testCart, 1)); // Ожидается: []
console.log("7.", testCart);                    // Ожидается: Чай — старая на месте


// ── Шаг 8 · сценарий покупателя: собираем всё вместе
// Повторяем: let и const (1). Массив не меняем — меняем, на какой массив указывает переменная.
let cart = [];
cart = addToCart(cart, 1);  // Чай
cart = addToCart(cart, 2);  // Кофе — нет в наличии
cart = addToCart(cart, 3);  // Сок
cart = addToCart(cart, 1);  // Чай ещё раз → qty 2
cart = addToCart(cart, 99); // нет такого товара

const beforeRemove = cart;
cart = removeFromCart(cart, 3);

console.log("8. До удаления:");
printCart(beforeRemove);
console.log("8. После удаления:");
printCart(cart);
console.log("8. Итого:", getTotal(cart), "сом");
console.log("8. Это разные массивы:", beforeRemove !== cart);
// Ожидается: до — Чай × 2, Сок × 1; после — Чай × 2; итого 360; true


// ── Бонус · скидка 10% от 500 сом
// Повторяем: тернарный оператор (4)
function getTotalWithDiscount(cart) {
  const total = getTotal(cart);
  return total >= 500 ? total - total / 10 : total;
}

console.log("Бонус:", getTotalWithDiscount(beforeRemove)); // 480 → без скидки: 480
console.log("Бонус:", getTotalWithDiscount([{ id: 1, name: "Чай", price: 180, qty: 3 }])); // 540 → 486
