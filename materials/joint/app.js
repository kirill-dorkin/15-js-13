// Магазин на странице. Кнопки вызывают функции из script.js. Этот файл менять не нужно.
(function () {
  let shopCatalog = [
    { id: 1, name: "Чай", price: 180 },
    { id: 2, name: "Кофе", price: 250 },
    { id: 3, name: "Сок", price: 150 },
    { id: 4, name: "Вода", price: 60 },
  ];
  let shopCart = [
    { id: 1, name: "Чай", price: 180, qty: 1 },
    { id: 2, name: "Кофе", price: 250, qty: 2 },
  ];
  const byId = (list, id) => list.find((x) => x.id === id);
  const bonusReady = () => { try { return typeof window.addOrIncrease === 'function' && window.addOrIncrease([], { id: 0, name: '', price: 0 }) !== undefined; } catch (e) { return false; } };

  function render() {
    document.getElementById('catalog').innerHTML = shopCatalog.map((p) =>
      '<div class="row"><div class="grow"><strong>' + esc(p.name) + '</strong><small>' + p.price + ' сом · id ' + p.id + '</small></div>' +
      '<button class="ghost" data-act="sale" data-id="' + p.id + '">−10%</button><button class="main" data-act="add" data-id="' + p.id + '">В корзину</button></div>').join('');
    document.getElementById('cart').innerHTML = shopCart.length ? shopCart.map((p) =>
      '<div class="row"><div class="grow"><strong>' + esc(p.name) + ' × ' + p.qty + '</strong><small>' + p.price + ' сом · id ' + p.id + '</small></div>' +
      '<button data-act="plus" data-id="' + p.id + '">+</button><button class="ghost" data-act="remove" data-id="' + p.id + '">✕</button></div>').join('')
      : '<div class="empty">Корзина пуста</div>';
    const total = shopCart.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.qty) || 0), 0);
    document.getElementById('total').textContent = total + ' сом';
  }

  document.querySelector('.app').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const id = Number(b.dataset.id), act = b.dataset.act;
    let res, text;
    if (act === 'add') {
      const product = byId(shopCatalog, id);
      const fn = bonusReady() ? 'addOrIncrease' : 'addToCart';
      res = callStudent(fn, [shopCart, product], 'array');
      text = fn + '(cart, ' + product.name + ') вернула новую корзину. Товаров в ней: ' + (res.value ? res.value.length : 0) + '.';
      if (!res.error) shopCart = res.value;
    } else if (act === 'remove') {
      res = callStudent('removeFromCart', [shopCart, id], 'array');
      text = 'removeFromCart(cart, ' + id + ') — товар убран.';
      if (!res.error) shopCart = res.value;
    } else if (act === 'plus') {
      res = callStudent('increaseQty', [shopCart, id], 'array');
      text = 'increaseQty(cart, ' + id + ') — количество +1.';
      if (!res.error) shopCart = res.value;
    } else if (act === 'sale') {
      const p = byId(shopCatalog, id), price = Math.round(p.price * 0.9);
      res = callStudent('changePrice', [shopCatalog, id, price], 'array');
      text = 'changePrice(catalog, ' + id + ', ' + price + ') — ' + p.name + ' теперь ' + price + ' сом. Цена в корзине не изменилась: там своя копия.';
      if (!res.error) shopCatalog = res.value;
    }
    showStatus(res, text);
    render();
  });
  render();
})();
