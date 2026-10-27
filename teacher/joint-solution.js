// Решение · Вместе: корзина
function addToCart(cart, product) {
  return [...cart, product];
}

function removeFromCart(cart, id) {
  return cart.filter((item) => item.id !== id);
}

function increaseQty(cart, id) {
  return cart.map((item) =>
    item.id === id ? { ...item, qty: item.qty + 1 } : item
  );
}
