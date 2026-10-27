// Урок 13 · Самостоятельно: плейлист
// Правило: функции НЕ меняют входные данные. Возвращаем новый массив / объект.

const playlist = [
  { id: 1, title: "Gulzada", artist: "Mirbek", likes: 12, saved: false },
  { id: 2, title: "Night City", artist: "Nova", likes: 40, saved: true },
  { id: 3, title: "Ala-Too", artist: "Aibek", likes: 7, saved: false },
];

const settings = {
  theme: "dark",
  player: { volume: 50, shuffle: false },
};

// 1. Добавить песню в конец
function addSong(playlist, song) {
}

// 2. Убрать песню по id
function removeSong(playlist, id) {
}

// 3. likes + 1 у песни с этим id
function likeSong(playlist, id) {
}

// 4. saved: !song.saved у песни с этим id
function toggleSaved(playlist, id) {
}

// 5. Бонус: новые settings, где player.volume = volume
//    Внимание: player — вложенный объект!
function setVolume(settings, volume) {
}

console.log(likeSong(playlist, 1));
console.log(playlist); // должен остаться прежним
