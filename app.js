"use strict";
/* JavaScript · Урок 13 · Ссылки и обновление данных
   Слайды описаны данными ниже. Типы: cover, quiz, theory, memory, table, bugs, practice, summary, end. */

const C = { 1: '#7956f7', 2: '#1f9fd0', 3: '#2caf8b', 4: '#e0892c', A: '#d0569a', B: '#4f6bed' };

// ───────── Пошаговые схемы памяти
// vars: [имя, значение] — значение-строка = примитив, {ref:'1'} = ссылка
// heap: [{id, kind:'object'|'array', props:[[ключ, значение]] }]
const MEMORY = {
  primitive: {
    code: 'let price = 100;\nlet copy = price;\ncopy = 150;\nconsole.log(price, copy);',
    steps: [
      { line: 1, label: 'В price лежит само число 100.', vars: [['price', '100']], heap: [] },
      { line: 2, label: 'copy получает КОПИЮ значения. Теперь это два независимых числа.', vars: [['price', '100'], ['copy', '100', 'new']], heap: [] },
      { line: 3, label: 'Меняем copy. price это не касается — у неё своё число.', vars: [['price', '100'], ['copy', '150', 'changed']], heap: [] },
      { line: 4, label: 'Примитивы (числа, строки, boolean) копируются значением.', vars: [['price', '100'], ['copy', '150']], heap: [], logs: ['100 150'] },
    ],
  },
  reference: {
    code: 'const tea = { name: "Чай", price: 180 };\nconst sameTea = tea;\nsameTea.price = 200;\nconsole.log(tea.price);\nconsole.log(tea === sameTea);',
    steps: [
      { line: 1, label: 'Объект создаётся в памяти (#1). В tea лежит не объект, а ссылка на него.', vars: [['tea', { ref: '1' }]], heap: [{ id: '1', props: [['name', '"Чай"'], ['price', '180']], fresh: true }] },
      { line: 2, label: 'sameTea = tea копирует ССЫЛКУ. Новый объект не появился — у #1 теперь два ярлыка.', vars: [['tea', { ref: '1' }], ['sameTea', { ref: '1' }, 'new']], heap: [{ id: '1', props: [['name', '"Чай"'], ['price', '180']] }] },
      { line: 3, label: 'Меняем через sameTea — меняется тот самый объект #1.', vars: [['tea', { ref: '1' }], ['sameTea', { ref: '1' }]], heap: [{ id: '1', props: [['name', '"Чай"'], ['price', '200', 'changed']] }] },
      { line: 4, label: 'Читаем через tea — видим 200. Объект один на двоих.', vars: [['tea', { ref: '1' }], ['sameTea', { ref: '1' }]], heap: [{ id: '1', props: [['name', '"Чай"'], ['price', '200']] }], logs: ['200'] },
      { line: 5, label: '=== для объектов сравнивает ссылки: обе ведут к #1 → true.', vars: [['tea', { ref: '1' }], ['sameTea', { ref: '1' }]], heap: [{ id: '1', props: [['name', '"Чай"'], ['price', '200']] }], logs: ['200', 'true'] },
    ],
  },
  fn: {
    code: 'function applyDiscount(product) {\n  product.price = product.price - 50;\n  return product;\n}\nconst coffee = { name: "Кофе", price: 250 };\nconst sale = applyDiscount(coffee);\nconsole.log(coffee.price);',
    steps: [
      { line: 5, label: 'coffee → объект #1 с ценой 250.', vars: [['coffee', { ref: '1' }]], heap: [{ id: '1', props: [['name', '"Кофе"'], ['price', '250']], fresh: true }] },
      { line: 6, label: 'Вызов функции: параметр product получает ту же ссылку на #1.', vars: [['coffee', { ref: '1' }], ['product', { ref: '1' }, 'new']], heap: [{ id: '1', props: [['name', '"Кофе"'], ['price', '250']] }] },
      { line: 2, label: 'Функция меняет свойство — то есть исходный объект coffee!', vars: [['coffee', { ref: '1' }], ['product', { ref: '1' }]], heap: [{ id: '1', props: [['name', '"Кофе"'], ['price', '200', 'changed']] }] },
      { line: 6, label: 'return product возвращает ту же ссылку. sale — третий ярлык на #1.', vars: [['coffee', { ref: '1' }], ['sale', { ref: '1' }, 'new']], heap: [{ id: '1', props: [['name', '"Кофе"'], ['price', '200']] }] },
      { line: 7, label: 'Хотели «цену со скидкой», а испортили оригинал. Это называется мутация.', vars: [['coffee', { ref: '1' }], ['sale', { ref: '1' }]], heap: [{ id: '1', props: [['name', '"Кофе"'], ['price', '200']] }], logs: ['200'] },
    ],
  },
  spread: {
    code: 'const tea = { name: "Чай", price: 180 };\nconst newTea = { ...tea, price: 200 };\nconsole.log(tea.price, newTea.price);\nconsole.log(tea === newTea);',
    steps: [
      { line: 1, label: 'tea → объект #1.', vars: [['tea', { ref: '1' }]], heap: [{ id: '1', props: [['name', '"Чай"'], ['price', '180']], fresh: true }] },
      { line: 2, label: '{ } создаёт НОВЫЙ объект #2. ...tea копирует в него свойства #1.', vars: [['tea', { ref: '1' }]], heap: [{ id: '1', props: [['name', '"Чай"'], ['price', '180']] }, { id: '2', props: [['name', '"Чай"', 'new'], ['price', '180', 'new']], fresh: true }] },
      { line: 2, label: 'price: 200 стоит после ...tea и перезаписывает скопированное значение.', vars: [['tea', { ref: '1' }], ['newTea', { ref: '2' }, 'new']], heap: [{ id: '1', props: [['name', '"Чай"'], ['price', '180']] }, { id: '2', props: [['name', '"Чай"'], ['price', '200', 'changed']] }] },
      { line: 3, label: 'Оригинал не тронут: 180 и 200.', vars: [['tea', { ref: '1' }], ['newTea', { ref: '2' }]], heap: [{ id: '1', props: [['name', '"Чай"'], ['price', '180']] }, { id: '2', props: [['name', '"Чай"'], ['price', '200']] }], logs: ['180 200'] },
      { line: 4, label: 'Два разных объекта → разные ссылки → false.', vars: [['tea', { ref: '1' }], ['newTea', { ref: '2' }]], heap: [{ id: '1', props: [['name', '"Чай"'], ['price', '180']] }, { id: '2', props: [['name', '"Чай"'], ['price', '200']] }], logs: ['180 200', 'false'] },
    ],
  },
  update: {
    code: 'const cart = [\n  { id: 1, name: "Чай", qty: 1 },\n  { id: 2, name: "Кофе", qty: 2 }\n];\nconst next = cart.map((item) =>\n  item.id === 2 ? { ...item, qty: item.qty + 1 } : item\n);\nconsole.log(cart[1].qty, next[1].qty);\nconsole.log(cart[0] === next[0]);',
    steps: (() => {
      const o1 = { id: '1', props: [['id', '1'], ['name', '"Чай"'], ['qty', '1']] };
      const o2 = { id: '2', props: [['id', '2'], ['name', '"Кофе"'], ['qty', '2']] };
      const arrA = (fresh) => ({ id: 'A', kind: 'array', props: [['0', { ref: '1' }], ['1', { ref: '2' }]], fresh });
      return [
        { line: 4, label: 'cart → массив A. В его ячейках тоже ссылки: на #1 и #2.', vars: [['cart', { ref: 'A' }]], heap: [arrA(true), { ...o1, fresh: true }, { ...o2, fresh: true }] },
        { line: 5, label: 'map создаёт НОВЫЙ массив B и вызывает callback для каждого item.', vars: [['cart', { ref: 'A' }], ['item', { ref: '1' }, 'new']], heap: [arrA(), o1, o2, { id: 'B', kind: 'array', props: [], fresh: true }] },
        { line: 6, label: 'item #1: id не 2 → возвращаем тот же item. В B кладётся та же ссылка на #1.', vars: [['cart', { ref: 'A' }], ['item', { ref: '1' }]], heap: [arrA(), o1, o2, { id: 'B', kind: 'array', props: [['0', { ref: '1' }, 'new']] }] },
        { line: 6, label: 'item #2: id === 2 → { ...item, qty: 3 } — новый объект #3. Старый #2 не тронут.', vars: [['cart', { ref: 'A' }], ['item', { ref: '2' }]], heap: [arrA(), o1, o2, { id: '3', props: [['id', '2'], ['name', '"Кофе"'], ['qty', '3', 'changed']], fresh: true }, { id: 'B', kind: 'array', props: [['0', { ref: '1' }], ['1', { ref: '3' }, 'new']] }] },
        { line: 7, label: 'next → B. Исходная корзина cart прежняя.', vars: [['cart', { ref: 'A' }], ['next', { ref: 'B' }, 'new']], heap: [arrA(), o1, o2, { id: '3', props: [['id', '2'], ['name', '"Кофе"'], ['qty', '3']] }, { id: 'B', kind: 'array', props: [['0', { ref: '1' }], ['1', { ref: '3' }]] }] },
        { line: 9, label: 'cart[1].qty = 2, next[1].qty = 3. Неизменённый Чай общий в обоих массивах → true.', vars: [['cart', { ref: 'A' }], ['next', { ref: 'B' }]], heap: [arrA(), o1, o2, { id: '3', props: [['id', '2'], ['name', '"Кофе"'], ['qty', '3']] }, { id: 'B', kind: 'array', props: [['0', { ref: '1' }], ['1', { ref: '3' }]] }], logs: ['2 3', 'true'] },
      ];
    })(),
  },
  shallow: {
    code: 'const user = {\n  name: "Айдар",\n  address: { city: "Бишкек" }\n};\nconst copy = { ...user };\ncopy.address.city = "Ош";\nconsole.log(user.address.city);',
    steps: [
      { line: 4, label: 'Внутри user ещё один объект — address (#2). В user лежит ссылка на него.', vars: [['user', { ref: '1' }]], heap: [{ id: '1', props: [['name', '"Айдар"'], ['address', { ref: '2' }]], fresh: true }, { id: '2', props: [['city', '"Бишкек"']], fresh: true }] },
      { line: 5, label: '{ ...user } — новый объект #3. Но копируется только первый уровень: address — та же ссылка на #2!', vars: [['user', { ref: '1' }], ['copy', { ref: '3' }, 'new']], heap: [{ id: '1', props: [['name', '"Айдар"'], ['address', { ref: '2' }]] }, { id: '2', props: [['city', '"Бишкек"']] }, { id: '3', props: [['name', '"Айдар"', 'new'], ['address', { ref: '2' }, 'new']], fresh: true }] },
      { line: 6, label: 'Меняем город через копию → меняется общий #2.', vars: [['user', { ref: '1' }], ['copy', { ref: '3' }]], heap: [{ id: '1', props: [['name', '"Айдар"'], ['address', { ref: '2' }]] }, { id: '2', props: [['city', '"Ош"', 'changed']] }, { id: '3', props: [['name', '"Айдар"'], ['address', { ref: '2' }]] }] },
      { line: 7, label: 'У оригинала тоже Ош. Spread — поверхностная копия: вложенное нужно копировать отдельно.', vars: [['user', { ref: '1' }], ['copy', { ref: '3' }]], heap: [{ id: '1', props: [['name', '"Айдар"'], ['address', { ref: '2' }]] }, { id: '2', props: [['city', '"Ош"']] }, { id: '3', props: [['name', '"Айдар"'], ['address', { ref: '2' }]] }], logs: ['Ош'] },
    ],
  },
};

// ───────── Слайды
const slides = [
  { type: 'cover', title: 'Ссылки и обновление данных', section: 'Начало', minutes: 2, notes: 'Главная мысль урока: переменная с объектом хранит не сам объект, а ссылку на него. Отсюда — как правильно копировать и обновлять данные, не ломая исходные. Это фундамент для React. План 90 минут: 10 разминка и проблема, 40 теория со схемами, 20 вместе, 15 самостоятельно, 5 шпаргалка.' },
  { type: 'quiz', label: '02 / РАЗМИНКА', section: 'Разминка', title: 'Вспомним <em>find</em>', lead: 'Прошлый урок. Сначала ответ вслух, потом кнопка.', minutes: 2,
    code: 'const products = [\n  { id: 1, name: "Чай" },\n  { id: 2, name: "Кофе" }\n];\nconst found = products.find((p) => p.id === 3);\nconsole.log(found);',
    question: 'Что выведется?', choices: ['undefined', 'null', '[]', 'Ошибка'], correct: 0,
    explain: 'find не нашёл подходящий элемент → undefined. Поэтому после find всегда проверяем: if (!found) { … }.', notes: 'Быстрое повторение. Важно: find возвращает сам объект из массива — сегодня увидим, почему это значит «ссылку».' },
  { type: 'theory', label: '03 / ПРОБЛЕМА', section: 'Проблема', title: 'Поменяли «копию» — <em>сломался каталог</em>', lead: 'Реальная ошибка из магазина. Почему скидка для одного клиента досталась всем?', minutes: 4,
    code: 'const catalog = [\n  { id: 1, name: "Чай", price: 180 }\n];\n\n// клиенту дали промокод\nconst cartItem = catalog[0];\ncartItem.price = 0;\n\nconsole.log(catalog[0].price); // 0 — у всех!',
    items: [['Ожидание', 'Хотели бесплатный чай только в корзине этого клиента.'], ['Реальность', 'Цена стала 0 в общем каталоге — для всех покупателей.'], ['Причина', 'cartItem — не копия. Это вторая ссылка на тот же объект в памяти.']],
    notes: 'Не объясняйте сразу. Спросите группу: «почему?» Дайте 1–2 гипотезы и пообещайте разобраться через схему памяти.' },
  { type: 'memory', demo: 'primitive', label: '04 / ЗНАЧЕНИЯ', section: 'Значение и ссылка', title: 'Примитивы <em>копируются значением</em>', lead: 'Нажимайте «Следующий шаг». Слева строка кода, справа — что в памяти.', minutes: 3, notes: 'Числа, строки, boolean, null, undefined — примитивы. Присваивание создаёт независимую копию. Это ожидаемое поведение — ученики его уже знают.' },
  { type: 'memory', demo: 'reference', label: '05 / ССЫЛКИ', section: 'Значение и ссылка', title: 'Объект — <em>один на двоих</em>', lead: 'Главный слайд урока. Переменная хранит ссылку — «адрес» объекта.', minutes: 5, notes: 'Метафора: объект — это квартира, переменная — ключ от неё. sameTea = tea сделал дубликат ключа, а не вторую квартиру. Кто бы ни вошёл, переставляет мебель в той же квартире.' },
  { type: 'quiz', label: '06 / ПРОВЕРКА', section: 'Значение и ссылка', title: 'Предскажите <em>результат</em>', lead: 'Представьте схему памяти.', minutes: 2,
    code: 'const a = { count: 1 };\nconst b = a;\nb.count = 5;\nconsole.log(a.count);', question: 'Что выведется?', choices: ['1', '5', 'undefined'], correct: 1,
    explain: 'b = a — вторая ссылка на тот же объект. Меняем через b — видим через a: 5.', notes: 'Если ошиблись — вернитесь на слайд 5 и пройдите шаги ещё раз.' },
  { type: 'theory', label: '07 / СРАВНЕНИЕ', section: 'Значение и ссылка', title: '<em>===</em> сравнивает ссылки', lead: 'Два одинаковых по содержимому объекта — это всё равно два разных объекта.', minutes: 3,
    code: 'const a = { name: "Чай" };\nconst b = { name: "Чай" };\nconst c = a;\n\nconsole.log(a === b);           // false\nconsole.log(a === c);           // true\nconsole.log(a.name === b.name); // true\n\nconsole.log([] === []);         // false',
    items: [['Объекты и массивы', '=== проверяет: это один и тот же объект в памяти?'], ['Одинаковое содержимое ≠ равенство', 'Каждые { } и [ ] создают новый объект с новой ссылкой.'], ['Как сравнивать', 'По нужному полю: item.id === id, a.name === b.name.']],
    notes: 'Частая ошибка новичков: if (item === { id: 2 }) — никогда не true.' },
  { type: 'theory', label: '08 / CONST', section: 'Значение и ссылка', title: '<em>const</em> не замораживает объект', lead: 'const запрещает поменять ссылку в переменной. Содержимое объекта менять можно.', minutes: 3,
    code: 'const cart = [];\ncart.push("Чай");      // ✓ можно\ncart[0] = "Кофе";      // ✓ можно\n\nconst user = { name: "Аня" };\nuser.name = "Алина";   // ✓ можно\n\ncart = ["Сок"];        // ✗ TypeError\nuser = {};             // ✗ TypeError',
    items: [['Что запрещает const', 'Присвоить переменной другое значение: cart = …'], ['Что разрешает', 'Менять свойства и элементы: push, user.name = …'], ['Неизменность', 'Её обеспечиваем сами: создаём копии вместо изменений.']],
    notes: 'Object.freeze можно упомянуть одной фразой, но не углубляться.' },
  { type: 'memory', demo: 'fn', label: '09 / ФУНКЦИИ', section: 'Мутация', title: 'Функция <em>портит оригинал</em>', lead: 'Аргумент-объект передаётся ссылкой. Изменить его свойство — изменить исходник.', minutes: 4, notes: 'Это и есть ошибка со слайда 3, только внутри функции. Слово «мутация» — изменение существующего объекта. Сегодня учимся обновлять без мутации.' },
  { type: 'memory', demo: 'spread', label: '10 / SPREAD', section: 'Копия объекта', title: '<em>{ ...obj }</em> — новый объект', lead: 'Спред копирует свойства в новые фигурные скобки. Дальше можно перезаписать нужное.', minutes: 4, notes: 'Произносим: «новый объект, в который скопировали всё из tea, и поменяли цену».' },
  { type: 'theory', label: '11 / ПОРЯДОК', section: 'Копия объекта', title: 'Что правее — <em>то и победит</em>', lead: 'Spread копирует по порядку. Повторный ключ перезаписывает предыдущий.', minutes: 3,
    code: 'const tea = { name: "Чай", price: 180 };\n\nconst copy = { ...tea };\nconst cheaper = { ...tea, price: 150 };\nconst wrong = { price: 150, ...tea };\n\nconsole.log(cheaper.price); // 150\nconsole.log(wrong.price);   // 180 — перезаписали обратно\nconsole.log(copy === tea);  // false',
    items: [['Копия', '{ ...tea } — новый объект с теми же свойствами.'], ['Копия + изменение', '{ ...tea, price: 150 } — изменения пишем ПОСЛЕ spread.'], ['Ловушка', '{ price: 150, ...tea } — spread затёр нашу цену старой.']], notes: 'Покажите wrong: многие ставят новое значение первым.' },
  { type: 'quiz', label: '12 / ПРОВЕРКА', section: 'Копия объекта', title: 'Порядок <em>в spread</em>', lead: 'Внимательно на порядок.', minutes: 2,
    code: 'const p = { price: 100 };\nconst q = { price: 50, ...p };\nconsole.log(q.price);', question: 'Что выведется?', choices: ['50', '100', '150'], correct: 1,
    explain: 'Сначала price: 50, затем ...p записывает price: 100 поверх. Правее — главнее.', notes: '' },
  { type: 'theory', label: '13 / МАССИВЫ', section: 'Обновление массива', title: 'Добавить и удалить <em>без мутации</em>', lead: 'Создаём новый массив. Исходный не трогаем.', minutes: 4,
    code: 'const cart = [\n  { id: 1, name: "Чай" },\n  { id: 2, name: "Кофе" }\n];\n\nconst added = [...cart, { id: 3, name: "Сок" }];\nconst first = [{ id: 0, name: "Вода" }, ...cart];\nconst removed = cart.filter((item) => item.id !== 2);\n\nconsole.log(cart.length);    // 2 — не изменился\nconsole.log(added.length);   // 3\nconsole.log(removed.length); // 1',
    items: [['Добавить в конец', '[...cart, новый] — вместо push.'], ['Добавить в начало', '[новый, ...cart] — вместо unshift.'], ['Удалить', 'filter: оставляем всех, у кого id !== удаляемому.']], notes: 'Проговорите filter «наоборот»: мы не удаляем, а оставляем всех остальных.' },
  { type: 'memory', demo: 'update', label: '14 / ОБНОВИТЬ', section: 'Обновление массива', title: 'Изменить один элемент — <em>map + spread</em>', lead: 'Главный приём урока. Пройдите все шаги.', minutes: 5, notes: 'Обратите внимание на последний шаг: неизменённые объекты переиспользуются — копируем только то, что меняем.' },
  { type: 'theory', label: '15 / ШАБЛОН', section: 'Обновление массива', title: 'Шаблон <em>обновления по id</em>', lead: 'Запомните форму. Она понадобится в каждом приложении и в React.', minutes: 4,
    code: 'const next = cart.map((item) => {\n  if (item.id !== 2) {\n    return item;          // остальные — как есть\n  }\n  return { ...item, qty: item.qty + 1 };\n});\n\n// то же короче\nconst next2 = cart.map((item) =>\n  item.id === 2 ? { ...item, qty: item.qty + 1 } : item\n);',
    items: [['1. Найти по id', 'item.id === id — сравниваем поле, а не объект.'], ['2. Новый объект', '{ ...item, поле: новоеЗначение } — только для нужного.'], ['3. Остальных вернуть', 'return item — иначе в массиве появится undefined.']], notes: 'Сначала полная форма с if, короткую — как бонус.' },
  { type: 'table', label: '16 / МЕТОДЫ', section: 'Обновление массива', title: 'Какие методы <em>меняют исходный</em>', lead: 'Мутирующие методы меняют массив на месте. Безопасные возвращают новый.', minutes: 3, notes: 'sort — главная ловушка: выглядит как «получить отсортированное», но портит исходный массив.' },
  { type: 'quiz', label: '17 / ПРОВЕРКА', section: 'Обновление массива', title: 'map <em>без return</em>', lead: 'Что будет с остальными элементами?', minutes: 2,
    code: 'const nums = [1, 2, 3];\nconst res = nums.map((n) => {\n  if (n === 2) {\n    return 20;\n  }\n});\nconsole.log(res);', question: 'Что выведется?', choices: ['[1, 20, 3]', '[undefined, 20, undefined]', '[20]'], correct: 1,
    explain: 'map кладёт в новый массив то, что вернул callback. Для 1 и 3 return не сработал → undefined.', notes: '' },
  { type: 'memory', demo: 'shallow', label: '18 / ВЛОЖЕННОЕ', section: 'Вложенные данные', title: 'Spread копирует <em>только первый уровень</em>', lead: 'Вложенный объект остаётся общим.', minutes: 4, notes: 'Это ответ на вопрос «почему моя копия всё равно меняет оригинал».' },
  { type: 'theory', label: '19 / ВЛОЖЕННОЕ', section: 'Вложенные данные', title: 'Копируем <em>каждый уровень</em>, который меняем', lead: 'Для вложенных данных spread пишется на каждом уровне пути к изменению.', minutes: 3,
    code: 'const moved = {\n  ...user,\n  address: { ...user.address, city: "Ош" }\n};\n\nconsole.log(user.address.city);  // "Бишкек"\nconsole.log(moved.address.city); // "Ош"\n\n// полная (глубокая) копия всего объекта:\nconst deep = structuredClone(user);',
    items: [['Правило', 'Меняете вложенное — скопируйте и его: address: { ...user.address, … }.'], ['structuredClone', 'Глубокая копия целиком. Удобно, но копирует всё — даже то, что не меняли.'], ['Не JSON', 'JSON.parse(JSON.stringify(x)) теряет undefined, функции и превращает Date в строку.']], notes: '' },
  { type: 'quiz', label: '20 / ПРОВЕРКА', section: 'Вложенные данные', title: 'Массив <em>внутри объекта</em>', lead: 'Тот же принцип, только вложен массив.', minutes: 2,
    code: 'const user = { name: "Аня", tags: ["js"] };\nconst copy = { ...user };\ncopy.tags.push("react");\nconsole.log(user.tags);', question: 'Что выведется?', choices: ['["js"]', '["js", "react"]', 'Ошибка'], correct: 1,
    explain: 'tags в копии — та же ссылка на массив. push мутирует общий массив. Правильно: { ...user, tags: [...user.tags, "react"] }.', notes: '' },
  { type: 'bugs', label: '21 / ОТЛАДКА', section: 'Ошибки', title: 'Найдите <em>ошибку</em>', lead: 'Сначала группа объясняет, что не так. Потом откройте исправление.', minutes: 6, notes: 'Слева — 5 случаев. По одному ученику на случай. Требуйте назвать причину, а не только исправление. Открытые случаи отмечаются зелёным.' },
  { type: 'theory', label: '22 / ЗАЧЕМ', section: 'Зачем это всё', title: 'Через месяц — <em>React</em>', lead: 'React понимает «данные изменились», только если пришёл новый объект или массив.', minutes: 2,
    code: '// так React НЕ увидит изменений:\ncart.push(tea);\nsetCart(cart);              // та же ссылка\n\n// так увидит и перерисует:\nsetCart([...cart, tea]);    // новый массив\n\nsetCart(cart.map((item) =>\n  item.id === id ? { ...item, qty: item.qty + 1 } : item\n));',
    items: [['Сравнение ссылок', 'React сравнивает старое и новое состояние через ===.'], ['Новая ссылка', 'Новый массив/объект = «есть изменения» → перерисовка.'], ['Сегодняшний урок', 'Это и есть код для React — только без React.']], notes: 'Мотивация: всё, что сегодня выучили, — ежедневный код React-разработчика.' },
  { type: 'practice', practice: 'joint', label: '23 / ВМЕСТЕ', section: 'Практика', title: 'Вместе: <em>корзина MiniShop</em>', lead: 'Каждая кнопка магазина вызывает функцию. Функции пустые — пишем их по очереди, и магазин оживает.', minutes: 20, notes: 'Откройте materials/joint/index.html на проекторе и script.js в редакторе рядом. Покажите: кнопка «В корзину» не работает — внизу написано почему. Пишем addToCart вместе, F5, жмём кнопку — товар появился, у задания ✅. Дальше так же по одной функции. Если кто-то напишет push — страница покажет «Мутация!»: разберите это.' },
  { type: 'practice', practice: 'solo', label: '24 / САМИ', section: 'Практика', title: 'Самостоятельно: <em>плейлист</em>', lead: 'То же самое, но с песнями. Каждая кнопка плеера — одна функция. Цель: все задания ✅.', minutes: 15, notes: 'Ученики открывают materials/solo/index.html. Под каждым заданием есть «было → стало» и подсказка. Не подсказывайте код — спрашивайте: «какой метод возвращает новый массив?».' },
  { type: 'summary', part: 'concepts', label: '25 / ШПАРГАЛКА 1/2', section: 'Итог', title: 'Шпаргалка: <em>главные понятия</em>', lead: 'Всё правило урока на одном экране. Листать презентацию не нужно — можно распечатать или скачать.', minutes: 3, notes: 'Пусть ученики сфотографируют или скачают. Пройдитесь по каждому блоку одной фразой.' },
  { type: 'summary', part: 'exceptions', label: '26 / ШПАРГАЛКА 2/2', section: 'Итог', title: 'Шпаргалка: <em>исключения и ловушки</em>', lead: 'Именно эти случаи дают ошибки в домашке. Проверьте себя по списку.', minutes: 3, notes: 'Спросите по 2–3 пункта: «почему так?» — без подсказки.' },
  { type: 'end', title: 'Готово', section: 'Итог', minutes: 1, notes: 'Домашнее задание: список задач. Проверка встроена в файл.' },
];

const METHODS = [
  ['push / pop', 'добавить / убрать с конца', true, '[...arr, x]  ·  arr.slice(0, -1)'],
  ['unshift / shift', 'добавить / убрать с начала', true, '[x, ...arr]  ·  arr.slice(1)'],
  ['splice', 'удалить или вставить в середину', true, 'filter / map / slice'],
  ['sort / reverse', 'сортировать / перевернуть', true, '[...arr].sort()  ·  arr.toSorted()'],
  ['arr[i] = x', 'присвоить элемент', true, 'arr.map(...)'],
  ['map / filter', 'преобразовать / отобрать', false, 'возвращают новый массив'],
  ['find / some / every', 'найти / проверить', false, 'ничего не меняют'],
  ['slice / concat', 'часть / склеить', false, 'возвращают новый массив'],
  ['[...arr] / {...obj}', 'поверхностная копия', false, 'новый массив / объект'],
];

const BUGS = [
  { title: 'Изменили остальные элементы на undefined', bad: 'cart.map((item) => {\n  if (item.id === 2) {\n    return { ...item, qty: 3 };\n  }\n});', good: 'cart.map((item) => {\n  if (item.id === 2) {\n    return { ...item, qty: 3 };\n  }\n  return item;\n});', why: 'map кладёт в результат то, что вернул callback. Нет return для остальных → undefined.' },
  { title: 'Стрелка «возвращает» пустоту', bad: 'cart.map((item) => { ...item, qty: 1 });', good: 'cart.map((item) => ({ ...item, qty: 1 }));', why: '{ после => — это тело функции, а не объект. Объект из стрелки оборачиваем в круглые скобки.' },
  { title: 'Отсортировали — испортили исходный', bad: 'const sorted = prices.sort((a, b) => a - b);\nconsole.log(prices); // тоже отсортирован', good: 'const sorted = [...prices].sort((a, b) => a - b);', why: 'sort мутирует массив на месте и возвращает ту же ссылку. Сначала копия.' },
  { title: 'Скидка поменяла каталог', bad: 'const item = catalog.find((p) => p.id === 1);\nitem.price = 0;', good: 'const item = catalog.find((p) => p.id === 1);\nconst discounted = { ...item, price: 0 };', why: 'find возвращает ссылку на объект из массива. Изменение «найденного» меняет каталог.' },
  { title: 'Сравнение никогда не true', bad: 'cart.filter((item) => item !== { id: 2 });', good: 'cart.filter((item) => item.id !== 2);', why: '{ id: 2 } — новый объект с новой ссылкой. Сравниваем по полю id.' },
];

const PRACTICE = {
  joint: {
    caption: 'materials/joint · 20 минут', zip: './materials/joint.zip', app: 'мини-магазин', files: 'index.html · script.js',
    tasks: [
      ['Кнопка «В корзину»', 'addToCart(cart, product)', 'новая корзина + товар в конце'],
      ['Кнопка «✕»', 'removeFromCart(cart, id)', 'новая корзина без товара — filter'],
      ['Кнопка «+»', 'increaseQty(cart, id)', 'у одного товара qty + 1 — map + spread'],
      ['Кнопка «−10%»', 'changePrice(catalog, id, price)', 'новый каталог с новой ценой'],
      ['Бонус: без дублей', 'addOrIncrease(cart, product)', 'есть в корзине → +1, нет → добавить'],
    ],
  },
  solo: {
    caption: 'materials/solo · 15 минут', zip: './materials/solo.zip', app: 'музыкальный плеер', files: 'index.html · script.js',
    tasks: [
      ['Кнопка «Добавить»', 'addSong(playlist, song)', 'новый плейлист + песня в конце'],
      ['Кнопка «✕»', 'removeSong(playlist, id)', 'плейлист без песни'],
      ['Кнопка «♥»', 'likeSong(playlist, id)', 'likes + 1 у одной песни'],
      ['Кнопка «☆»', 'toggleSaved(playlist, id)', 'saved: !song.saved'],
      ['Бонус: громкость', 'setVolume(settings, volume)', 'вложенный player — копируем оба уровня'],
    ],
  },
};

// ───────── Движок (на основе урока 11)
const stage = document.getElementById('stage');
const store = Object.create(null);
let current = 0, toastTimeout;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const state = () => store[current] || (store[current] = { step: 0 });
const removeTags = (s) => String(s).replace(/<[^>]*>/g, '');

const KW = 'const|let|function|return|if|else|true|false|null|undefined|new|typeof';
const MT = 'console|log|map|filter|find|some|every|push|pop|shift|unshift|splice|sort|reverse|slice|concat|structuredClone|length|setCart|JSON|parse|stringify|toSorted';
function highlight(s) {
  const re = new RegExp('(\\/\\/[^\\n]*|"(?:\\\\.|[^"\\\\])*"|\\b(?:' + KW + ')\\b|\\b(?:' + MT + ')\\b|\\.\\.\\.|\\b\\d+\\b|===|!==|=>|\\+)', 'g');
  return String(s).split(re).map((t) => {
    let cls = '';
    if (/^\/\//.test(t)) cls = 'comment';
    else if (/^"/.test(t)) cls = 'string';
    else if (new RegExp('^(' + KW + ')$').test(t)) cls = 'keyword';
    else if (new RegExp('^(' + MT + ')$').test(t)) cls = 'method';
    else if (/^\d+$/.test(t)) cls = 'number';
    else if (/^(===|!==|=>|\+|\.\.\.)$/.test(t)) cls = t === '...' ? 'spread' : 'operator';
    return cls ? '<span class="token ' + cls + '">' + esc(t) + '</span>' : esc(t);
  }).join('');
}
function codeWindow(code, active = -1, caption = 'script.js') {
  return '<div class="code-window"><div class="code-head"><span><span class="dots"><i></i><i></i><i></i></span></span><span>' + esc(caption) + '</span></div><pre class="code-pre">' + String(code).split('\n').map((line, i) => '<span class="code-line ' + (active === i + 1 ? 'active-line' : '') + '"><span class="line-no">' + (i + 1) + '</span><span>' + highlight(line || ' ') + '</span></span>').join('') + '</pre></div>';
}
function head(s) { return '<div class="intro"><span class="tag ' + (s.type === 'practice' ? 'green' : s.type === 'quiz' ? 'cyan' : '') + '">' + (s.label || '13 / JAVASCRIPT') + '</span><h2>' + s.title + '</h2><p>' + s.lead + '</p></div>'; }

function quiz(s, st) {
  const answered = Number.isInteger(st.answer);
  return '<div class="quiz-grid"><div class="quiz-left"><div class="quiz-question">' + esc(s.question) + '</div><div class="quiz-options">' + s.choices.map((c, i) => '<button class="answer-option ' + (answered ? (i === s.correct ? 'correct' : i === st.answer ? 'wrong' : '') : '') + ' ' + (st.answer === i ? 'selected' : '') + '" data-action="answer" data-value="' + i + '" aria-pressed="' + (st.answer === i) + '"><b style="display:inline-block;width:24px;color:var(--purple)">' + String.fromCharCode(65 + i) + '.</b> ' + esc(c) + '</button>').join('') + '</div>' + (answered ? '<div class="feedback ' + (st.answer === s.correct ? '' : 'warn') + '">' + (st.answer === s.correct ? '✓ Верно. ' : 'Не совсем. ') + esc(s.explain) + '</div><button class="small-btn" data-action="reset-answer">Ответить ещё раз ↺</button>' : '<p class="action-hint">Выберите вариант — появится разбор.</p>') + '</div><div class="quiz-right">' + codeWindow(s.code) + '</div></div>';
}

function theoryView(s) {
  return '<div class="pair"><div class="pane left"><div class="pane-heading">КОД</div>' + codeWindow(s.code) + '</div><div class="pane right theory-pane">' + s.items.map((x, i) => '<div class="concept"><span>' + String(i + 1).padStart(2, '0') + '</span><div><h3>' + esc(x[0]) + '</h3><p>' + esc(x[1]) + '</p></div></div>').join('') + '</div></div>';
}

// Схема памяти
const refBadge = (id, mark = '') => '<span class="ref ' + mark + '" style="--c:' + C[id] + '">→ #' + id + '</span>';
function memVal(v, mark) {
  if (v && typeof v === 'object' && v.ref) return refBadge(v.ref, mark);
  return '<span class="prim ' + (mark || '') + '">' + esc(v) + '</span>';
}
function memoryView(kind, st) {
  const m = MEMORY[kind];
  const idx = Math.max(0, Math.min(st.step || 0, m.steps.length - 1));
  const t = m.steps[idx];
  const vars = t.vars.map(([name, val, mark]) => '<div class="mem-var ' + (mark || '') + '"><code>' + esc(name) + '</code>' + memVal(val, mark) + '</div>').join('');
  const heap = t.heap.length ? [...t.heap].sort((a, b) => (b.kind === 'array') - (a.kind === 'array')).map((o) => '<div class="mem-obj ' + (o.fresh ? 'fresh' : '') + '" style="--c:' + C[o.id] + '"><div class="mem-obj-head"><b>#' + o.id + '</b><span>' + (o.kind === 'array' ? 'массив [ ]' : 'объект { }') + '</span></div>' + (o.props.length ? o.props.map(([k, v, mark]) => '<div class="mem-prop ' + (mark || '') + '"><span class="k">' + (o.kind === 'array' ? '[' + esc(k) + ']' : esc(k)) + '</span>' + memVal(v, mark) + '</div>').join('') : '<div class="mem-empty">пока пусто</div>') + '</div>').join('') : '<div class="mem-empty big">Объектов нет — только примитивы</div>';
  const logs = t.logs && t.logs.length ? t.logs.map((l) => '<span class="entry">' + esc(l) + '</span>').join('') : '<span class="empty">Вывода пока нет</span>';
  return '<div class="pair mem-pair"><div class="pane left"><div class="pane-heading"><span>01 / КОД</span><span class="caps">ТЕКУЩАЯ СТРОКА</span></div>' + codeWindow(m.code, t.line) + '<div class="console"><strong>КОНСОЛЬ</strong>' + logs + '</div></div>'
    + '<div class="pane right"><div class="pane-heading"><span>02 / ПАМЯТЬ</span><span>' + (idx + 1) + ' / ' + m.steps.length + '</span></div>'
    + '<div class="mem-step">' + esc(t.label) + '</div>'
    + '<div class="mem-grid' + (t.heap.length > 3 ? ' dense' : '') + '"><div class="mem-col"><div class="caps">ПЕРЕМЕННЫЕ</div>' + vars + '</div><div class="mem-col"><div class="caps">ОБЪЕКТЫ В ПАМЯТИ</div><div class="mem-heap">' + heap + '</div></div></div>'
    + '<div class="buttons push-bottom"><button class="secondary" data-action="prev-step" ' + (idx === 0 ? 'disabled' : '') + '>← Шаг назад</button><button class="primary" data-action="next-step" ' + (idx === m.steps.length - 1 ? 'disabled' : '') + '>Следующий шаг →</button><button class="secondary" data-action="reset-step" title="Сначала">↺</button></div></div></div>';
}

function tableView() {
  const rows = (mut) => METHODS.filter((r) => r[2] === mut).map((r) => '<div class="m-row"><code>' + esc(r[0]) + '</code><span>' + esc(r[1]) + '</span><em>' + esc(r[3]) + '</em></div>').join('');
  return '<div class="m-grid"><div class="m-card bad"><div class="m-head"><b>⚠ Меняют исходный</b><span>мутирующие</span></div>' + rows(true) + '<p class="m-foot">Справа — чем заменить, чтобы не мутировать.</p></div><div class="m-card good"><div class="m-head"><b>✓ Возвращают новое</b><span>безопасные</span></div>' + rows(false) + '<p class="m-foot">Это и есть инструменты для обновления данных.</p></div></div>';
}

function bugsView(st) {
  st.open = st.open || {};
  const i = st.bug || 0, b = BUGS[i], open = st.open[i];
  return '<div class="bugs2"><div class="bug-list">' + BUGS.map((x, k) => '<button class="bug-tab ' + (k === i ? 'active' : '') + ' ' + (st.open[k] ? 'done' : '') + '" data-action="bug-pick" data-value="' + k + '"><span>' + String(k + 1).padStart(2, '0') + '</span>' + esc(x.title) + '</button>').join('') + '</div>'
    + '<div class="bug-main"><div class="bug-col"><div class="caps bad-cap">✗ С ОШИБКОЙ</div>' + codeWindow(b.bad, -1, 'bug.js') + '</div>'
    + (open ? '<div class="bug-col"><div class="caps good-cap">✓ ИСПРАВЛЕНО</div>' + codeWindow(b.good, -1, 'fix.js') + '<p class="bug-why">' + esc(b.why) + '</p></div>'
      : '<div class="bug-hidden"><p>Почему это ошибка? Ответьте вслух.</p><button class="primary" data-action="bug" data-value="' + i + '">Показать исправление</button></div>')
    + '</div></div>';
}

function practice(s, st) {
  const p = PRACTICE[s.practice];
  const joint = s.practice === 'joint';
  const remaining = st.remaining ?? s.minutes * 60;
  return '<div class="practice-layout"><div class="task-list"><div class="pane-heading">КНОПКА → ФУНКЦИЯ → ЧТО ВЕРНУТЬ<span>script.js</span></div>'
    + p.tasks.map((x, i) => '<div class="task-step pr-row"><i>' + String(i + 1).padStart(2, '0') + '</i><div class="pr-btn">' + esc(x[0]) + '</div><code>' + esc(x[1]) + '</code><div class="pr-ret">→ ' + esc(x[2]) + '</div></div>').join('')
    + '<div class="tip">Каждая функция <b>не меняет</b> входные данные и <b>возвращает новые</b>. Страница сама заменит старые данные на новые — как будет в React.</div></div>'
    + '<div class="task-side"><div class="goal"><span class="caps">' + esc(p.caption) + '</span><h3>' + (joint ? 'Оживляем магазин' : 'Оживляем плеер') + '</h3>'
    + '<ol class="flow"><li>Открыть <b>index.html</b> — там ' + esc(p.app) + ', кнопки пока не работают</li><li>Написать одну функцию в <b>script.js</b></li><li>Сохранить и обновить страницу (F5)</li><li>Нажать кнопку: работает → у задания ✅</li></ol>'
    + '<div class="minutes" id="timerDisplay" role="timer">' + formatTime(remaining) + '</div><div class="buttons"><button class="primary" data-action="timer">' + (st.running ? 'Пауза' : 'Старт таймера') + '</button><button class="secondary" data-action="timer-reset">Сброс</button></div></div>'
    + '<div class="download"><div class="file-label">Файлы практики<small>' + esc(p.files) + ' · подсказки внутри</small></div><a href="' + p.zip.replace('.zip', '/index.html') + '" target="_blank" rel="noopener" class="open-link">Открыть</a><a href="' + p.zip + '" download>↓ ZIP</a></div></div></div>';
}

const SUMMARY = [
  ['Значение и ссылка', ['Примитивы (number, string, boolean, null, undefined) копируются <b>значением</b>.', 'Объекты, массивы и функции — <b>ссылкой</b>: переменная хранит «адрес» объекта.', '<code>b = a</code> для объекта — второй ярлык на тот же объект, не копия.']],
  ['Сравнение и const', ['<code>===</code> у объектов сравнивает ссылки: <code>{} === {}</code> → false.', 'Сравниваем по полю: <code>item.id === id</code>.', '<code>const</code> запрещает переприсвоить переменную, но не менять содержимое.']],
  ['Функции и мутация', ['Объект-аргумент приходит ссылкой: <code>product.price = …</code> меняет оригинал.', 'Мутация — изменение существующего объекта или массива.', 'Хорошая функция возвращает новые данные и не трогает входные.']],
  ['Копия объекта', ['<code>{ ...obj }</code> — новый объект с теми же свойствами.', '<code>{ ...obj, price: 150 }</code> — копия с изменением.', 'Что правее — то и победит: изменения пишем <b>после</b> spread.']],
  ['Массив без мутации', ['Добавить: <code>[...arr, x]</code> / <code>[x, ...arr]</code>.', 'Удалить: <code>arr.filter((i) => i.id !== id)</code>.', 'Изменить один: <code>arr.map((i) => i.id === id ? { ...i, qty: 2 } : i)</code>.']],
  ['Вложенные данные', ['Spread копирует только <b>первый уровень</b>.', 'Меняете вложенное — копируйте каждый уровень пути:<br><code>{ ...user, address: { ...user.address, city } }</code>.', '<code>structuredClone(obj)</code> — полная глубокая копия.']],
];
const EXCEPTIONS = [
  '<code>const arr = []</code> и <code>arr.push(1)</code> — работает: содержимое const-массива менять можно.',
  '<code>sort</code> и <code>reverse</code> меняют исходный массив. Сначала копия: <code>[...arr].sort()</code>.',
  'Стрелка возвращает объект только в скобках: <code>(i) => ({ ...i })</code>. Без скобок — undefined.',
  'В <code>map</code> верните значение для <b>каждого</b> элемента, иначе получите undefined.',
  '<code>find</code> возвращает ссылку из массива: изменили найденное — изменили массив.',
  '<code>JSON.parse(JSON.stringify(x))</code> теряет undefined и функции, Date превращает в строку — лучше structuredClone.',
  'Переприсвоить параметр (<code>product = {…}</code>) — не меняет внешнюю переменную. Менять его свойства — меняет.',
  'Строки неизменяемы: <code>toUpperCase</code>, <code>slice</code> и т.д. всегда возвращают новую строку.',
  '<code>[...arr]</code> — новый массив, но объекты внутри те же: менять их через копию массива нельзя.',
  'В <code>map</code> неизменённые элементы возвращаем как есть (<code>return item</code>) — копировать всё не нужно.',
];
function summaryView(s) {
  const buttons = '<div class="buttons sum-actions"><a class="primary" href="./materials/SUMMARY.md" download>↓ Шпаргалка .md</a><button class="secondary" data-action="print">Печать / PDF</button></div>';
  if (s.part === 'exceptions') {
    return '<div class="exc-grid">' + EXCEPTIONS.map((x, i) => '<div class="exc-card"><span>' + String(i + 1).padStart(2, '0') + '</span><p>' + x + '</p></div>').join('') + '</div>' + buttons;
  }
  return '<div class="sum-grid">' + SUMMARY.map(([h, list], i) => '<div class="sum-card"><div class="sum-n">' + String(i + 1).padStart(2, '0') + '</div><h3>' + h + '</h3><ul>' + list.map((x) => '<li>' + x + '</li>').join('') + '</ul></div>').join('') + '</div>' + buttons;
}
function cover() {
  return '<div class="cover-grid"><div class="cover-copy"><div class="overline"><i></i> JAVASCRIPT <b></b> УРОК 13</div><h1>Одна ссылка.<br><span>Два имени.</span></h1><p>Почему «копия» портит оригинал — и как обновлять данные, не ломая их.</p><div class="pills"><span>ссылки</span><span>===</span><span>{ ...spread }</span><span>map + id</span><span>без мутаций</span></div><button class="primary" data-action="next-slide">Начать урок ↗</button></div>'
    + '<div class="cover-art"><div class="art-glow"></div><div class="art-glow two"></div><div class="art-stage"><div class="art-card"><div class="art-heading"><span>REF LAB / 13</span><span>память</span></div>'
    + '<div class="cover-mem"><div class="cv-vars"><div><code>tea</code><span class="ref" style="--c:' + C[1] + '">→ #1</span></div><div><code>sameTea</code><span class="ref" style="--c:' + C[1] + '">→ #1</span></div><div><code>newTea</code><span class="ref" style="--c:' + C[2] + '">→ #2</span></div></div>'
    + '<div class="cv-heap"><div class="mem-obj" style="--c:' + C[1] + '"><div class="mem-obj-head"><b>#1</b><span>объект</span></div><div class="mem-prop"><span class="k">price</span><span class="prim">180</span></div></div><div class="mem-obj" style="--c:' + C[2] + '"><div class="mem-obj-head"><b>#2</b><span>копия</span></div><div class="mem-prop changed"><span class="k">price</span><span class="prim changed">200</span></div></div></div></div>'
    + '<div class="art-input">' + highlight('const newTea = { ...tea, price: 200 };') + '</div></div></div></div></div>';
}
function finish() {
  return '<div class="closing"><div class="closing-mark">{ }</div><span class="tag green">УРОК 13 / ГОТОВО</span><h1>Не меняем.<br><em>Создаём новое.</em></h1><p>Объекты живут по ссылке. Копия — через spread. Обновление — через map по id. Удаление — через filter.</p><div class="end-tags"><span>{ ...obj }</span><span>[...arr, x]</span><span>filter → удалить</span><span>map → обновить</span></div><div class="buttons" style="justify-content:center"><a class="primary" href="./materials/homework.zip" download>↓ Домашнее задание</a><a class="secondary" href="./materials/SUMMARY.md" download>↓ Шпаргалка</a></div><p class="lesson-note">Дальше: деструктуризация и условия — урок 14.</p></div>';
}

function formatTime(t) { return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); }
function toggleTimer() { const st = state(); st.remaining ??= slides[current].minutes * 60; st.running = !st.running; render(false); }
setInterval(() => {
  Object.keys(store).forEach((k) => {
    const st = store[k];
    if (!st.running) return;
    if (st.remaining > 0) st.remaining--;
    if (st.remaining === 0) { st.running = false; if (Number(k) === current) { render(false); notify('Время практики закончилось'); } }
    if (Number(k) === current) { const el = document.getElementById('timerDisplay'); if (el) el.textContent = formatTime(st.remaining); }
  });
}, 1000);

function render(isNavigation) {
  const s = slides[current], st = state();
  let content = '';
  switch (s.type) {
    case 'cover': content = cover(); break;
    case 'memory': content = head(s) + memoryView(s.demo, st); break;
    case 'theory': content = head(s) + theoryView(s); break;
    case 'quiz': content = head(s) + quiz(s, st); break;
    case 'table': content = head(s) + tableView(); break;
    case 'bugs': content = head(s) + bugsView(st); break;
    case 'practice': content = head(s) + practice(s, st); break;
    case 'summary': content = head(s) + summaryView(s); break;
    case 'end': content = finish(); break;
  }
  stage.innerHTML = '<section class="slide active ' + (isNavigation ? '' : 'instant') + ' ' + (s.type === 'cover' ? 'cover' : '') + ' type-' + s.type + '" aria-label="Слайд ' + (current + 1) + ' из ' + slides.length + '">' + (s.type === 'cover' || s.type === 'end' ? content : '<div class="slide-content">' + content + '</div>') + '</section>';
  document.getElementById('sectionTitle').textContent = s.section;
  document.getElementById('currentTitle').textContent = removeTags(s.title);
  document.getElementById('slideCounter').textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  document.getElementById('progressSection').textContent = s.section.toUpperCase();
  document.getElementById('progressFill').style.width = ((current + 1) / slides.length * 100) + '%';
  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === slides.length - 1;
  document.getElementById('nextBtn').querySelector('span').textContent = current === slides.length - 1 ? 'Конец' : 'Дальше';
  document.querySelectorAll('[data-slide]').forEach((b, i) => { b.classList.toggle('active', i === current); b.setAttribute('aria-current', i === current ? 'page' : 'false'); });
  document.getElementById('notesContent').innerHTML = '<h3>' + esc(removeTags(s.title)) + '</h3><p>' + esc(s.notes || '') + '</p><p><b>План на слайд:</b> ' + s.minutes + ' мин.</p>';
}
function fromHash() { const h = Number(location.hash.replace('#', '')); return Number.isInteger(h) && h >= 1 && h <= slides.length ? h - 1 : 0; }
function go(i, push = true) { current = Math.max(0, Math.min(slides.length - 1, i)); if (push && location.hash !== '#' + (current + 1)) history.replaceState(null, '', '#' + (current + 1)); render(true); }
function closeOverlays() { document.getElementById('outlineOverlay').hidden = true; document.getElementById('notesOverlay').hidden = true; }
function toggleOverlay(id) { const el = document.getElementById(id), open = el.hidden; closeOverlays(); el.hidden = !open; if (open) el.querySelector('button')?.focus(); }
function notify(msg) { const el = document.getElementById('toast'); el.textContent = msg; el.classList.add('visible'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('visible'), 1900); }

stage.addEventListener('click', (e) => {
  const node = e.target.closest('[data-action]');
  if (!node) return;
  const action = node.dataset.action, st = state();
  if (action === 'next-slide') { go(current + 1); return; }
  if (action === 'answer') { st.answer = Number(node.dataset.value); render(false); return; }
  if (action === 'reset-answer') { delete st.answer; render(false); return; }
  if (action === 'timer') { toggleTimer(); return; }
  if (action === 'timer-reset') { st.remaining = slides[current].minutes * 60; st.running = false; render(false); return; }
  if (action === 'reset-step') { st.step = 0; render(false); return; }
  if (action === 'prev-step') { st.step = Math.max(0, (st.step || 0) - 1); render(false); return; }
  if (action === 'next-step') { const m = MEMORY[slides[current].demo]; st.step = Math.min(m.steps.length - 1, (st.step || 0) + 1); render(false); return; }
  if (action === 'bug') { st.open = st.open || {}; st.open[Number(node.dataset.value)] = true; render(false); return; }
  if (action === 'bug-pick') { st.bug = Number(node.dataset.value); render(false); return; }
  if (action === 'print') { window.print(); }
});
document.getElementById('prevBtn').addEventListener('click', () => go(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => go(current + 1));
document.getElementById('outlineBtn').addEventListener('click', () => toggleOverlay('outlineOverlay'));
document.getElementById('notesBtn').addEventListener('click', () => toggleOverlay('notesOverlay'));
document.getElementById('themeBtn').addEventListener('click', () => { document.body.classList.toggle('dark'); try { localStorage.setItem('ref-lab-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); } catch (e) { /* */ } });
document.getElementById('fullscreenBtn').addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen?.(); else document.documentElement.requestFullscreen?.(); });
document.querySelectorAll('[data-close]').forEach((n) => n.addEventListener('click', closeOverlays));
document.getElementById('outlineList').innerHTML = slides.map((s, i) => '<button type="button" data-slide="' + i + '"><strong>' + String(i + 1).padStart(2, '0') + '</strong><span>' + esc(removeTags(s.title)) + '</span></button>').join('');
document.getElementById('outlineList').addEventListener('click', (e) => { const n = e.target.closest('[data-slide]'); if (n) { closeOverlays(); go(Number(n.dataset.slide)); } });
window.addEventListener('hashchange', () => { const next = fromHash(); if (next !== current) go(next, false); });
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeOverlays(); return; }
  if (!document.getElementById('outlineOverlay').hidden || !document.getElementById('notesOverlay').hidden) return;
  const editing = e.target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable);
  if (editing) return;
  const s = slides[current], st = state();
  if (s.type === 'memory' && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); const m = MEMORY[s.demo]; st.step = Math.min(m.steps.length - 1, (st.step || 0) + 1); render(false); return; }
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(current + 1); return; }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(current - 1); return; }
  if (e.key === 'Home') { e.preventDefault(); go(0); } else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); }
  else if (e.key.toLowerCase() === 'g') toggleOverlay('outlineOverlay');
  else if (e.key.toLowerCase() === 'n') toggleOverlay('notesOverlay');
  else if (e.key.toLowerCase() === 't') document.getElementById('themeBtn').click();
  else if (e.key.toLowerCase() === 'f') document.getElementById('fullscreenBtn').click();
});
try { if (localStorage.getItem('ref-lab-theme') === 'dark') document.body.classList.add('dark'); } catch (e) { /* */ }
if (!location.hash) history.replaceState(null, '', '#1');
current = fromHash();
render(true);
