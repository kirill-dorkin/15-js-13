// Автопроверка заданий. Этот файл менять не нужно.
(function () {
  const CATALOG = [{ id: 1, name: "Чай", price: 180 }, { id: 2, name: "Кофе", price: 250 }, { id: 3, name: "Сок", price: 150 }];
  const CART = [{ id: 1, name: "Чай", price: 180, qty: 1 }, { id: 2, name: "Кофе", price: 250, qty: 2 }];

  check('addToCart', (fn, t) => {
    const c = t.freeze(CART), res = fn(c, t.freeze(CATALOG[2]));
    if (res === undefined) return 'wait';
    if (!Array.isArray(res)) t.fail('Нужно вернуть массив.');
    if (res === c) t.fail('Вернулась та же корзина. Нужен новый массив: [...cart, …].');
    if (res.length !== 3) t.fail('Ожидалось 3 товара, получилось ' + res.length + '.');
    if (!t.same(res[2], { id: 3, name: "Сок", price: 150, qty: 1 })) t.fail('Последний товар должен быть { ...product, qty: 1 }. Сейчас: ' + JSON.stringify(res[2]));
  });

  check('removeFromCart', (fn, t) => {
    const c = t.freeze(CART), res = fn(c, 2);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res)) t.fail('Нужно вернуть массив.');
    if (!t.same(res, [CART[0]])) t.fail('После удаления id 2 должен остаться только Чай. Сейчас: ' + JSON.stringify(res));
  });

  check('increaseQty', (fn, t) => {
    const c = t.freeze(CART), res = fn(c, 2);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.length !== 2) t.fail('Нужен массив той же длины (2 товара).');
    if (res.includes(undefined)) t.fail('В массиве undefined: для остальных товаров нужно return item.');
    if (res[1].qty !== 3) t.fail('У Кофе qty должно стать 3, сейчас ' + res[1].qty + '.');
    if (res[1] === c[1]) t.fail('Изменённый товар должен быть новым объектом: { ...item, qty: … }.');
    if (res[0] !== c[0]) t.fail('Чай не меняли — верните его как есть (return item).');
  });

  check('changePrice', (fn, t) => {
    const c = t.freeze(CATALOG), res = fn(c, 1, 99);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.length !== 3) t.fail('Нужен массив той же длины.');
    if (res.includes(undefined)) t.fail('В массиве undefined: для остальных товаров нужно вернуть product.');
    if (res[0].price !== 99) t.fail('У Чая цена должна стать 99.');
    if (res[1] !== c[1]) t.fail('Остальные товары возвращаем как есть.');
  });

  check('addOrIncrease', (fn, t) => {
    const c = t.freeze(CART);
    const a = fn(c, t.freeze(CATALOG[0]));
    if (a === undefined) return 'wait';
    if (!Array.isArray(a) || a.length !== 2 || a[0].qty !== 2) t.fail('Чай уже в корзине → в корзине 2 товара, у Чая qty 2.');
    const b = fn(c, t.freeze(CATALOG[2]));
    if (!b || b.length !== 3 || b[2].qty !== 1) t.fail('Сока нет в корзине → добавить в конец с qty: 1.');
  });

  reportChecks();
})();
