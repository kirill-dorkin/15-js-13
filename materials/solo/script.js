// ═══════════════════════════════════════════════
//  JS 13 · Практика сами: плейлист
//  Результат — в консоли: F12 → Console. После сохранения — F5.
//  Правило урока: старый плейлист НЕ меняем, а возвращаем НОВЫЙ.
//  Подсказка: это те же шаги, что в корзине на совместной практике.
// ═══════════════════════════════════════════════

const library = [
  { id: 1, title: "Gulzada", artist: "Mirbek" },
  { id: 2, title: "Night City", artist: "Nova" },
  { id: 3, title: "Ala-Too", artist: "Aibek" },
];


// ── Шаг 1 · найти песню по id
// Как findProduct: find (12)
function findSong(id) {

}

console.log("1.", findSong(2));  // Ожидается: объект Night City
console.log("1.", findSong(10)); // Ожидается: undefined


// ── Шаг 2 · строка для песни
// Как formatItem: шаблонная строка (7)
function formatSong(song) {

}

console.log("2.", formatSong({ id: 1, title: "Gulzada", artist: "Mirbek", likes: 5 }));
// Ожидается: Gulzada — Mirbek ♥ 5


// ── Шаг 3 · показать плейлист
// Как printCart: if + length (4, 8), forEach (11)
function printPlaylist(playlist) {

}

console.log("3.");
printPlaylist([]);
// Ожидается: Плейлист пуст


// ── Шаг 4 · сколько всего лайков
// Как getTotal: for...of (9)
function getTotalLikes(playlist) {

}

console.log("4.", getTotalLikes([{ likes: 3 }, { likes: 4 }])); // Ожидается: 7


// ── Шаг 5 · лайк (НОВОЕ)
// Как increaseQty: map + spread
function likeSong(playlist, id) {

}

const testList = [{ id: 1, title: "Gulzada", artist: "Mirbek", likes: 0 }];
console.log("5. Новый: ", likeSong(testList, 1)); // Ожидается: likes 1
console.log("5. Старый:", testList);              // Ожидается: likes 0 — не изменился


// ── Шаг 6 · добавить песню (НОВОЕ)
// Как addToCart, но без повторов:
// 1) найти песню; нет → сообщение, вернуть playlist
// 2) уже есть (some) → сообщение «уже в плейлисте», вернуть playlist
// 3) иначе → новый плейлист: старые + { ...song, likes: 0 }
function addSong(playlist, id) {

}

console.log("6.", addSong([], 3)); // Ожидается: [Ala-Too, likes 0]


// ── Шаг 7 · удалить песню (НОВОЕ)
// Как removeFromCart: filter
function removeSong(playlist, id) {

}

console.log("7.", removeSong(testList, 1)); // Ожидается: []


// ── Шаг 8 · сценарий
// Напишите сценарий:
// 1. let playlist = []
// 2. Добавьте песни 1 и 2, потом снова 1 (повтор) и 10 (нет такой)
// 3. Дважды лайкните песню 2
// 4. Сохраните плейлист в const beforeRemove, затем удалите песню 1
// 5. Выведите оба плейлиста через printPlaylist и сумму лайков через getTotalLikes
// Ожидается: «Gulzada уже в плейлисте», «Песни с id 10 нет»;
// до — Gulzada ♥ 0, Night City ♥ 2; после — Night City ♥ 2; лайков 2
