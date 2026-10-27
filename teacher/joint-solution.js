// ═════════════════════════════════════════════
//  Урок 13 · Корзина магазина
//  Весь код страницы здесь. Мы пишем только раздел 2.
// ═════════════════════════════════════════════


// ─── 1. ДАННЫЕ ───────────────────────────────

const catalog = [
  { id: 1, name: "Чай", price: 180 },
  { id: 2, name: "Кофе", price: 250 },
  { id: 3, name: "Сок", price: 150 },
];

let cart = [
  { id: 1, name: "Чай", price: 180, qty: 1 },
  { id: 2, name: "Кофе", price: 250, qty: 2 },
];

let oldCart = cart;                  // корзина до последнего нажатия
let cartText = JSON.stringify(cart); // снимок корзины — чтобы заметить, если её испортили


// ─── 2. НАШИ ФУНКЦИИ ─────────────────────────
// Правило: старую корзину НЕ меняем. Возвращаем НОВУЮ.

// «В корзину»: новая корзина + product в конце
function addToCart(cart, product) {
  return [...cart, product];
}

// «✕»: новая корзина без товара с этим id
function removeFromCart(cart, id) {
  return cart.filter((item) => item.id !== id);
}

// «+»: новая корзина, где у товара с этим id qty + 1
function increaseQty(cart, id) {
  return cart.map((item) =>
    item.id === id ? { ...item, qty: item.qty + 1 } : item
  );
}


// ─── 3. КНОПКИ ───────────────────────────────
// Нажали кнопку → вызвали нашу функцию → получили новую корзину.

function clickAdd(id) {
  const product = catalog.find((p) => p.id === id);
  const inCart = cart.some((item) => item.id === id);

  if (inCart) {
    save(increaseQty(cart, id));           // уже есть — просто +1
  } else {
    save(addToCart(cart, { ...product, qty: 1 }));
  }
}

function clickRemove(id) {
  save(removeFromCart(cart, id));
}

function clickPlus(id) {
  save(increaseQty(cart, id));
}

// Запоминаем новую корзину и проверяем, что старая не испорчена
function save(newCart) {
  if (newCart === undefined) {
    showMessage("⏳ Функция пока пустая — нужен return.", "");
    return;
  }

  oldCart = cart;
  cart = newCart;

  if (oldCart === newCart) {
    showMessage("❌ Вернулся ТОТ ЖЕ массив. Нужен новый: [...cart], filter или map.", "bad");
  } else if (JSON.stringify(oldCart) !== cartText) {
    showMessage("❌ Старая корзина изменилась — это мутация. Посмотрите на «Было».", "bad");
  } else if (newCart.includes(undefined)) {
    showMessage("❌ В новой корзине undefined — в map нужно вернуть и остальные товары.", "bad");
  } else {
    showMessage("✅ Получили новую корзину. Старая не изменилась.", "ok");
  }
  cartText = JSON.stringify(cart);
  render();
}


// ─── 4. ПОКАЗ НА ЭКРАНЕ ──────────────────────

function showCart(list, withButtons) {
  if (list.length === 0) {
    return `<div class="empty">Пусто</div>`;
  }
  return list.map((item) => {
    if (item === undefined) {
      return `<div class="row bad">undefined — в map забыли вернуть товар</div>`;
    }
    const buttons = withButtons
      ? `<button onclick="clickPlus(${item.id})">+</button>
         <button onclick="clickRemove(${item.id})">✕</button>`
      : "";
    return `<div class="row"><span>${item.name} × ${item.qty}</span>${buttons}</div>`;
  }).join("");
}

function render() {
  document.querySelector("#catalog").innerHTML = catalog.map((p) => `
    <div class="row">
      <span>${p.name} <small>${p.price} сом</small></span>
      <button class="main" onclick="clickAdd(${p.id})">В корзину</button>
    </div>`).join("");

  document.querySelector("#before").innerHTML = showCart(oldCart, false);
  document.querySelector("#after").innerHTML = showCart(cart, true);

  const total = cart.reduce((sum, item) => sum + (item ? item.price * item.qty : 0), 0);
  document.querySelector("#total").textContent = "Итого: " + total + " сом";
}

function showMessage(text, type) {
  const box = document.querySelector("#message");
  box.textContent = text;
  box.className = type;
}

render();
showMessage("Нажмите любую кнопку.", "");
