// ═══════════════════════════════════════════════
//  JS 13 · Практика сами: плейлист
//  Результат смотрим в консоли: F12 → Console.
//  Правило: старый плейлист НЕ меняем, возвращаем НОВЫЙ.
// ═══════════════════════════════════════════════

const playlist = [
  { id: 1, title: "Gulzada", likes: 12 },
  { id: 2, title: "Night City", likes: 40 },
  { id: 3, title: "Ala-Too", likes: 7 },
];

const newSong = { id: 4, title: "Tengri", likes: 0 };

// Помощник для консоли: плейлист → ["Gulzada ♥12", ...]
function show(list) {
  if (list === undefined) {
    return "undefined — функция ничего не вернула (нет return)";
  }
  return list.map((song) => (song === undefined ? "undefined" : song.title + " ♥" + song.likes));
}


// ── 1. Добавить песню
// addSong(playlist, song) возвращает новый массив: все песни + song в конце.
function addSong(playlist, song) {

}

const list1 = addSong(playlist, newSong);
console.log("1. Новый: ", show(list1));    // Ожидается: 4 песни, Tengri последняя
console.log("1. Старый:", show(playlist)); // Ожидается: 3 песни


// ── 2. Удалить песню
// removeSong(playlist, id) возвращает новый массив без песни с этим id.
function removeSong(playlist, id) {

}

const list2 = removeSong(playlist, 1);
console.log("2. Новый: ", show(list2));    // Ожидается: ["Night City ♥40", "Ala-Too ♥7"]
console.log("2. Старый:", show(playlist)); // Ожидается: 3 песни


// ── 3. Лайк
// likeSong(playlist, id) возвращает новый массив.
// У песни с этим id — новый объект с likes + 1. Остальные — как есть.
function likeSong(playlist, id) {

}

const list3 = likeSong(playlist, 3);
console.log("3. Новый: ", show(list3));    // Ожидается: Ala-Too ♥8
console.log("3. Старый:", show(playlist)); // Ожидается: Ala-Too ♥7


// ── 4. Сравнить через ===
// Выведите в консоль три сравнения list3 и playlist:
//   массивы между собой           Ожидается: false
//   песня Ala-Too (индекс 2)      Ожидается: false
//   песня Gulzada (индекс 0)      Ожидается: true


// ── Бонус
// Напишите unlikeSong(playlist, id): likes - 1, но не меньше 0.
// Проверьте на newSong: у новой песни 0 лайков — должно остаться 0.

