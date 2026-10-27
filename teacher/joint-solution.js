// JS 13 · Практика вместе · решение (по шагам ТЗ из materials/joint/script.js)

// ── ШАГ 0 · ДАННЫЕ
const catalog = [
  { id: 1, name: "Чай", price: 180, inStock: true },
  { id: 2, name: "Кофе", price: 250, inStock: false },
  { id: 3, name: "Сок", price: 120, inStock: true },
  { id: 4, name: "Печенье", price: 90, inStock: true },
];
console.log(catalog);


// ── ШАГ 1 · РАЗМИНКА
const tea = catalog[0];
const teaCopy = { ...tea };
console.log(tea === catalog[0]);       // true  — та же ссылка
console.log(teaCopy === tea);          // false — spread создал новый объект
console.log(teaCopy.name === tea.name); // true  — строки сравниваются по значению


// ── ШАГ 2 · НАЙТИ ТОВАР
function findProduct(id) {
  return catalog.find((product) => product.id === id);
}
console.log(findProduct(3));
console.log(findProduct(99));


// ── ШАГ 3 · СТРОКА ДЛЯ ОДНОГО ТОВАРА
function formatItem(item) {
  return `${item.name} × ${item.qty} = ${item.price * item.qty} сом`;
}
console.log(formatItem({ id: 1, name: "Чай", price: 180, qty: 2 }));


// ── ШАГ 4 · ПОКАЗАТЬ КОРЗИНУ
function printCart(cart) {
  if (cart.length === 0) {
    console.log("Корзина пуста");
    return;
  }
  cart.forEach((item) => {
    console.log(formatItem(item));
  });
}
printCart([]);
printCart([{ id: 3, name: "Сок", price: 120, qty: 3 }]);


// ── ШАГ 5 · СУММА КОРЗИНЫ
function getTotal(cart) {
  let total = 0;
  for (const item of cart) {
    total += item.price * item.qty;
  }
  return total;
}
console.log(getTotal([{ name: "Чай", price: 180, qty: 2 }, { name: "Сок", price: 120, qty: 1 }]));


// ── ШАГ 6 · УВЕЛИЧИТЬ КОЛИЧЕСТВО
function increaseQty(cart, id) {
  return cart.map((item) =>
    item.id === id ? { ...item, qty: item.qty + 1 } : item
  );
}
const testCart = [{ id: 1, name: "Чай", price: 180, qty: 1 }];
console.log(increaseQty(testCart, 1));
console.log(testCart);


// ── ШАГ 7 · ДОБАВИТЬ В КОРЗИНУ
function addToCart(cart, id) {
  const product = findProduct(id);

  if (!product) {
    console.log(`Товара с id ${id} нет`);
    return cart;
  }
  if (!product.inStock) {
    console.log(`${product.name} нет в наличии`);
    return cart;
  }
  if (cart.some((item) => item.id === id)) {
    return increaseQty(cart, id);
  }
  return [...cart, { ...product, qty: 1 }];
}
console.log(addToCart([], 3));
console.log(addToCart([], 2));


// ── ШАГ 8 · УДАЛИТЬ ИЗ КОРЗИНЫ
function removeFromCart(cart, id) {
  return cart.filter((item) => item.id !== id);
}
console.log(removeFromCart(testCart, 1));
console.log(testCart);


// ── ШАГ 9 · СЦЕНАРИЙ ПОКУПАТЕЛЯ
let cart = [];
cart = addToCart(cart, 1);
cart = addToCart(cart, 2);
cart = addToCart(cart, 3);
cart = addToCart(cart, 1);
cart = addToCart(cart, 99);

const beforeRemove = cart;
cart = removeFromCart(cart, 3);

console.log("До удаления:");
printCart(beforeRemove);
console.log("После удаления:");
printCart(cart);
console.log("Итого:", getTotal(cart));
console.log("beforeRemove !== cart →", beforeRemove !== cart);
// cart — let, потому что переменная указывает на НОВЫЙ массив после каждой операции.
// Сами массивы мы не меняем: beforeRemove остался целым.


// ── БОНУС · СКИДКА
function getTotalWithDiscount(cart) {
  const total = getTotal(cart);
  return total >= 500 ? total - total / 10 : total;
}
console.log(getTotalWithDiscount([{ name: "Чай", price: 180, qty: 3 }]));                                   // 486
console.log(getTotalWithDiscount([{ name: "Чай", price: 180, qty: 2 }, { name: "Сок", price: 120, qty: 1 }])); // 480
