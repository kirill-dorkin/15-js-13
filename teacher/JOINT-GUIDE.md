# Урок 13 · Совместная практика — сценарий для преподавателя

Файл учеников: `materials/joint/script.js` — в нём **нет кода**, только ТЗ в комментариях: что сделать, зачем, что повторяем и что должно получиться в консоли. Весь код пишем вместе с нуля под каждым пунктом.
Полное решение: `teacher/joint-solution.js`.
Время: 25 минут. На проекторе: VS Code слева, браузер с консолью (F12) справа.

Порядок на каждом шаге: прочитать ТЗ вслух → спросить группу «как будем делать?» → писать код → F5 → сверить консоль с «Проверка».

Идея: собираем магазин в консоли. Каждый шаг повторяет 1–2 прошлых урока, с шага 6 добавляется новая тема — обновление без мутации. В конце всё складывается в один сценарий покупателя.

| Шаг | Что пишем | Повторяем | Мин |
|---|---|---|---|
| 0 | `const catalog = [...]` | массив объектов (8, 10) | 2 |
| 1 | Разминка: `===` | ссылки (сегодня) | 2 |
| 2 | `findProduct(id)` | функции, стрелки, find | 2 |
| 3 | `formatItem(item)` | шаблонные строки, арифметика | 2 |
| 4 | `printCart(cart)` | if, length, forEach | 2 |
| 5 | `getTotal(cart)` | for...of, += | 2 |
| 6 | `increaseQty(cart, id)` | **новое**: map + spread | 3 |
| 7 | `addToCart(cart, id)` | find, !, some + **новое**: `[...cart, x]` | 5 |
| 8 | `removeFromCart(cart, id)` | **новое**: filter | 1 |
| 9 | Сценарий покупателя | let/const, всё вместе | 4 |

---

## 0 · Данные (2 мин)

```js
const catalog = [
  { id: 1, name: "Чай", price: 180, inStock: true },
  { id: 2, name: "Кофе", price: 250, inStock: false },
  { id: 3, name: "Сок", price: 120, inStock: true },
  { id: 4, name: "Печенье", price: 90, inStock: true },
];
console.log(catalog);
```

Спросить: «Почему const?» → переменная всегда указывает на один и тот же каталог, и мы его не меняем. «Какого типа id и inStock?» → number и boolean (урок 2).

## 1 · Разминка (2 мин)

Пишем три console.log. **Перед F5** пусть группа ответит вслух на каждую строку.

```js
const tea = catalog[0];
const teaCopy = { ...tea };
tea === catalog[0]          // true  — та же ссылка
teaCopy === tea             // false — spread создал новый объект
teaCopy.name === tea.name   // true  — строки сравниваются по значению
```

Спросить: «Почему третья строка — true, а вторая — false?» Ответ: объекты сравниваются по ссылке, строки — по значению.

## 2 · findProduct (2 мин)

```js
function findProduct(id) {
  return catalog.find((product) => product.id === id);
}
```

Спросить: «Что вернёт find, если ничего не нашёл?» → `undefined` (урок 12).

## 3 · formatItem (2 мин)

```js
function formatItem(item) {
  return `${item.name} × ${item.qty} = ${item.price * item.qty} сом`;
}
```

Спросить: «Какие кавычки нужны для `${}`?» → обратные (урок 7).

## 4 · printCart (3 мин)

```js
function printCart(cart) {
  if (cart.length === 0) {
    console.log("Корзина пуста");
    return;
  }
  cart.forEach((item) => {
    console.log(formatItem(item));
  });
}
```

Спросить: «Зачем `return` после "Корзина пуста"?» → чтобы дальше не выполнялось. Заметьте: функция ничего не возвращает — она только печатает.

## 5 · getTotal (3 мин)

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

## 6 · increaseQty — новое (3 мин)

```js
function increaseQty(cart, id) {
  return cart.map((item) =>
    item.id === id ? { ...item, qty: item.qty + 1 } : item
  );
}
```

Проговорить по частям: map — новый массив; совпал id → новый объект `{ ...item, qty: … }`; не совпал → тот же item.

Проверка из ТЗ — создаём testCart и выводим обе корзины:
```js
const testCart = [{ id: 1, name: "Чай", price: 180, qty: 1 }];
console.log(increaseQty(testCart, 1)); // Чай qty 2
console.log(testCart);                 // Чай qty 1
```

**Покажите ошибку специально:** замените на `item.qty++; return item;` — testCart тоже станет qty 2. Это мутация: поменяли старый объект по ссылке. Верните правильный вариант.

## 7 · addToCart — всё вместе (5 мин)

Сначала проговорите план (он в комментарии над функцией), потом пишите по пунктам:

```js
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
```

Спросить:
- «Почему `!product`?» → find мог вернуть undefined.
- «Почему some, а не find?» → нужен ответ да/нет (урок 12).
- «Почему не `cart.push(...)`?» → push меняет старую корзину. Нам нужна новая.
- «Зачем `{ ...product, qty: 1 }`, а не просто product?» → product из каталога, у него нет qty. И если добавить к нему qty, испортится каталог.

## 8 · removeFromCart (1 мин)

```js
function removeFromCart(cart, id) {
  return cart.filter((item) => item.id !== id);
}
```

«Мы не удаляем — мы оставляем всех, кроме одного».

## 9 · Сценарий покупателя (4 мин)

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

console.log("До удаления:");
printCart(beforeRemove);
console.log("После удаления:");
printCart(cart);
console.log("Итого:", getTotal(cart));
console.log("beforeRemove !== cart →", beforeRemove !== cart);
```

Ожидается в консоли:
```
Кофе нет в наличии
Товара с id 99 нет
До удаления:
Чай × 2 = 360 сом
Сок × 1 = 120 сом
После удаления:
Чай × 2 = 360 сом
Итого: 360
beforeRemove !== cart → true
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
