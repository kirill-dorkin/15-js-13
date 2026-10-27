const CATALOG = [{ id: 1, name: "Чай", price: 180 }, { id: 2, name: "Кофе", price: 250 }, { id: 3, name: "Сок", price: 150 }];
const CART = [{ id: 1, name: "Чай", price: 180, qty: 1 }, { id: 2, name: "Кофе", price: 250, qty: 2 }];

check('1. addToCart', 'addToCart', (fn, t) => {
  const c = t.freeze(CART), res = fn(c, t.freeze(CATALOG[2]));
  if (res === undefined) return 'wait';
  if (!Array.isArray(res)) t.fail('Нужно вернуть массив.');
  if (res === c) t.fail('Вернулась та же корзина. Нужен новый массив: [...cart, …].');
  if (res.length !== 3) t.fail('Ожидалась длина 3, получилось ' + res.length + '.');
  if (!t.same(res[2], { id: 3, name: "Сок", price: 150, qty: 1 })) t.fail('Последний элемент должен быть { ...product, qty: 1 }. Сейчас: ' + JSON.stringify(res[2]));
  if (!t.same(c, CART)) t.fail('Исходная корзина изменилась.');
});

check('2. removeFromCart', 'removeFromCart', (fn, t) => {
  const c = t.freeze(CART), res = fn(c, 2);
  if (res === undefined) return 'wait';
  if (res === c) t.fail('Вернулась та же корзина.');
  if (!t.same(res, [CART[0]])) t.fail('Должен остаться только Чай. Сейчас: ' + JSON.stringify(res));
  if (!t.same(fn(c, 99), CART)) t.fail('Если id нет — корзина должна остаться прежней по содержимому.');
});

check('3. increaseQty', 'increaseQty', (fn, t) => {
  const c = t.freeze(CART), res = fn(c, 2);
  if (res === undefined) return 'wait';
  if (!Array.isArray(res) || res.length !== 2) t.fail('Нужен массив той же длины. Проверьте return в map.');
  if (res.includes(undefined)) t.fail('В массиве undefined: для остальных товаров нужно return item.');
  if (res[1].qty !== 3) t.fail('У Кофе qty должно стать 3, сейчас ' + res[1].qty + '.');
  if (res[1] === c[1]) t.fail('Изменённый товар должен быть НОВЫМ объектом: { ...item, qty: … }.');
  if (res[0] !== c[0]) t.fail('Неизменённый Чай нужно вернуть как есть (return item), без копии.');
  if (c[1].qty !== 2) t.fail('Исходная корзина изменилась.');
});

check('4. changePrice', 'changePrice', (fn, t) => {
  const c = t.freeze(CATALOG), res = fn(c, 1, 99);
  if (res === undefined) return 'wait';
  if (res === c) t.fail('Вернулся тот же каталог.');
  if (!res[0] || res[0].price !== 99) t.fail('У Чая цена должна стать 99.');
  if (res[1] !== c[1] || res[2] !== c[2]) t.fail('Остальные товары возвращаем как есть.');
  if (c[0].price !== 180) t.fail('Исходный каталог изменился.');
});

check('5. Бонус: addOrIncrease', 'addOrIncrease', (fn, t) => {
  const c = t.freeze(CART);
  const a = fn(c, t.freeze(CATALOG[0]));
  if (a === undefined) return 'wait';
  if (a.length !== 2 || a[0].qty !== 2) t.fail('Чай уже в корзине → длина 2, qty Чая 2.');
  const b = fn(c, t.freeze(CATALOG[2]));
  if (!b || b.length !== 3 || b[2].qty !== 1) t.fail('Сока нет в корзине → добавить с qty: 1.');
  if (!t.same(c, CART)) t.fail('Исходная корзина изменилась.');
});

reportChecks();
