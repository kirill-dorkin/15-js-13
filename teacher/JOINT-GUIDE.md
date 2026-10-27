# Урок 13 · Совместная практика — сценарий для преподавателя

Файл учеников: `materials/joint/script.js`. Полное решение: `teacher/joint-solution.js`.
Время: 25 минут. На проекторе: VS Code слева, браузер с консолью (F12) справа.

Идея: собираем магазин в консоли. Каждый шаг повторяет 1–2 прошлых урока, а с шага 5 добавляется новая тема — обновление без мутации. В конце всё складывается в один сценарий покупателя.

| Шаг | Что пишем | Повторяем | Мин |
|---|---|---|---|
| 0 | Разминка: `===` | ссылки (сегодня) | 2 |
| 1 | `findProduct(id)` | функции, стрелки, find | 2 |
| 2 | `formatItem(item)` | шаблонные строки, арифметика | 2 |
| 3 | `printCart(cart)` | if, length, forEach | 3 |
| 4 | `getTotal(cart)` | for...of, += | 3 |
| 5 | `increaseQty(cart, id)` | **новое**: map + spread | 3 |
| 6 | `addToCart(cart, id)` | find, !, some + **новое**: `[...cart, x]` | 5 |
| 7 | `removeFromCart(cart, id)` | **новое**: filter | 1 |
| 8 | Сценарий покупателя | let/const, всё вместе | 4 |

---

## 0 · Разминка (2 мин)

Код уже в файле. **Не обновляйте страницу**: сначала пусть группа ответит вслух на каждую строку.

```js
const tea = catalog[0];
const teaCopy = { ...tea };
tea === catalog[0]          // true  — та же ссылка
teaCopy === tea             // false — spread создал новый объект
teaCopy.name === tea.name   // true  — строки сравниваются по значению
```

Спросить: «Почему третья строка — true, а вторая — false?» Ответ: объекты сравниваются по ссылке, строки — по значению.

## 1 · findProduct (2 мин)

```js
function findProduct(id) {
  return catalog.find((product) => product.id === id);
}
```

Спросить: «Что вернёт find, если ничего не нашёл?» → `undefined` (урок 12).

## 2 · formatItem (2 мин)

```js
function formatItem(item) {
  return `${item.name} × ${item.qty} = ${item.price * item.qty} сом`;
}
```

Спросить: «Какие кавычки нужны для `${}`?» → обратные (урок 7).

## 3 · printCart (3 мин)

```js
function printCart(cart) {
  if (cart.length === 0) {
    console.log("   Корзина пуста");
    return;
  }
  cart.forEach((item) => {
    console.log("   " + formatItem(item));
  });
}
```

Спросить: «Зачем `return` после "Корзина пуста"?» → чтобы дальше не выполнялось. Заметьте: функция ничего не возвращает — она только печатает.

## 4 · getTotal (3 мин)

```js
function getTotal(cart) {
  let total = 0;
  for (const item of cart) {
    total += item.price * item.qty;
  }
  return total;
}
```

Спросить: «Почему `total` — let, а не const?» → значение меняется в цикле.

## 5 · increaseQty — новое (3 мин)

```js
function increaseQty(cart, id) {
  return cart.map((item) =>
    item.id === id ? { ...item, qty: item.qty + 1 } : item
  );
}
```

Проговорить по частям: map — новый массив; совпал id → новый объект `{ ...item, qty: … }`; не совпал → тот же item.
Смотрим в консоль: «Новая» — qty 2, «Старая» — qty 1.

**Покажите ошибку специально:** замените на `item.qty++; return item;` — в консоли «Старая» тоже станет qty 2. Это мутация: поменяли старый объект по ссылке. Верните правильный вариант.

## 6 · addToCart — всё вместе (5 мин)

Сначала проговорите план (он в комментарии над функцией), потом пишите по пунктам:

```js
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
```

Спросить:
- «Почему `!product`?» → find мог вернуть undefined.
- «Почему some, а не find?» → нужен ответ да/нет (урок 12).
- «Почему не `cart.push(...)`?» → push меняет старую корзину. Нам нужна новая.
- «Зачем `{ ...product, qty: 1 }`, а не просто product?» → product из каталога, у него нет qty. И если добавить к нему qty, испортится каталог.

## 7 · removeFromCart (1 мин)

```js
function removeFromCart(cart, id) {
  return cart.filter((item) => item.id !== id);
}
```

«Мы не удаляем — мы оставляем всех, кроме одного».

## 8 · Сценарий покупателя (4 мин)

Пишем внизу файла вместе:

```js
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
```

Ожидается в консоли:
```
   Кофе: нет в наличии
   Товара с id 99 нет
8. До удаления:
   Чай × 2 = 360 сом
   Сок × 1 = 120 сом
8. После удаления:
   Чай × 2 = 360 сом
8. Итого: 360 сом
8. Это разные массивы: true
```

Главный вопрос урока: **«Почему `cart` — let, если мы договорились ничего не менять?»** Массивы мы не меняем. Меняется только то, на какой массив указывает переменная: каждый раз это новый массив. Старая корзина `beforeRemove` осталась целой.

## Бонус — для быстрых

```js
function getTotalWithDiscount(cart) {
  const total = getTotal(cart);
  return total >= 500 ? total - total / 10 : total;
}
```

---

## Частые ошибки

| Ошибка | Что увидят |
|---|---|
| Нет `return` в функции | `undefined` в консоли |
| Обычные кавычки вместо обратных | в строке буквально `${item.name}` |
| `cart.push(...)` в addToCart | старая корзина тоже меняется |
| `item.qty++` в map | «Старая» в шаге 5 тоже qty 2 |
| `(item) => { ...item }` без скобок | SyntaxError — объект из стрелки пишем как `=> ({ ... })` |
| `=` вместо `===` в find | находится не тот товар или ошибка |
