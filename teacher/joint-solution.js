// Решение · Вместе: корзина MiniShop
function addToCart(cart, product) {
  return [...cart, { ...product, qty: 1 }];
}

function removeFromCart(cart, id) {
  return cart.filter((item) => item.id !== id);
}

function increaseQty(cart, id) {
  return cart.map((item) => {
    if (item.id !== id) {
      return item;
    }
    return { ...item, qty: item.qty + 1 };
  });
}

function changePrice(catalog, id, price) {
  return catalog.map((product) =>
    product.id === id ? { ...product, price } : product
  );
}

function addOrIncrease(cart, product) {
  const inCart = cart.some((item) => item.id === product.id);
  return inCart ? increaseQty(cart, product.id) : addToCart(cart, product);
}
