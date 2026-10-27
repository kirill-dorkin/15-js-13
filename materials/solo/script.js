// ─────────────────────────────────────────────────────────────
// Урок 13 · Самостоятельно: плейлист
//
// Плейлист — массив объектов-песен. Пример песни:
//   { id: 1, title: "Gulzada", artist: "Mirbek", likes: 12, saved: false }
//
// Настройки — объект с вложенным объектом player:
//   { theme: "dark", player: { volume: 50, shuffle: false } }
//
// Каждая функция = одна кнопка плеера (index.html).
// ПРАВИЛО: входные данные НЕ меняем. Возвращаем НОВЫЕ (return).
// После каждой функции: сохранить → обновить страницу (F5).
// ─────────────────────────────────────────────────────────────


// 1. «Добавить»: новый плейлист, где song — в конце.
function addSong(playlist, song) {

}


// 2. «✕»: новый плейлист без песни с этим id.
function removeSong(playlist, id) {

}


// 3. «♥»: у песни с этим id likes + 1. Остальные — как есть.
function likeSong(playlist, id) {

}


// 4. «☆»: у песни с этим id saved меняется на противоположное.
function toggleSaved(playlist, id) {

}


// 5. Бонус. Ползунок: новые settings, где player.volume = volume.
//    player — вложенный объект!
function setVolume(settings, volume) {

}
