// JS 13 · Практика сами · решение (по шагам ТЗ из materials/solo/script.js)

// ── ШАГ 0 · ДАННЫЕ
const library = [
  { id: 1, title: "Gulzada", artist: "Mirbek" },
  { id: 2, title: "Night City", artist: "Nova" },
  { id: 3, title: "Ala-Too", artist: "Aibek" },
];
console.log(library);


// ── ШАГ 1 · НАЙТИ ПЕСНЮ
function findSong(id) {
  return library.find((song) => song.id === id);
}
console.log(findSong(2));
console.log(findSong(10));


// ── ШАГ 2 · СТРОКА ДЛЯ ПЕСНИ
function formatSong(song) {
  return `${song.title} — ${song.artist} ♥ ${song.likes}`;
}
console.log(formatSong({ id: 1, title: "Gulzada", artist: "Mirbek", likes: 5 }));


// ── ШАГ 3 · ПОКАЗАТЬ ПЛЕЙЛИСТ
function printPlaylist(playlist) {
  if (playlist.length === 0) {
    console.log("Плейлист пуст");
    return;
  }
  playlist.forEach((song) => {
    console.log(formatSong(song));
  });
}
printPlaylist([]);


// ── ШАГ 4 · СКОЛЬКО ВСЕГО ЛАЙКОВ
function getTotalLikes(playlist) {
  let total = 0;
  for (const song of playlist) {
    total += song.likes;
  }
  return total;
}
console.log(getTotalLikes([{ likes: 3 }, { likes: 4 }]));


// ── ШАГ 5 · ЛАЙК
function likeSong(playlist, id) {
  return playlist.map((song) =>
    song.id === id ? { ...song, likes: song.likes + 1 } : song
  );
}
const testList = [{ id: 1, title: "Gulzada", artist: "Mirbek", likes: 0 }];
console.log(likeSong(testList, 1));
console.log(testList);


// ── ШАГ 6 · ДОБАВИТЬ ПЕСНЮ БЕЗ ПОВТОРОВ
function addSong(playlist, id) {
  const song = findSong(id);

  if (!song) {
    console.log(`Песни с id ${id} нет`);
    return playlist;
  }
  if (playlist.some((item) => item.id === id)) {
    console.log(`${song.title} уже в плейлисте`);
    return playlist;
  }
  return [...playlist, { ...song, likes: 0 }];
}
console.log(addSong([], 3));


// ── ШАГ 7 · УДАЛИТЬ ПЕСНЮ
function removeSong(playlist, id) {
  return playlist.filter((song) => song.id !== id);
}
console.log(removeSong(testList, 1));


// ── ШАГ 8 · СЦЕНАРИЙ
let playlist = [];
playlist = addSong(playlist, 1);
playlist = addSong(playlist, 2);
playlist = addSong(playlist, 1);
playlist = addSong(playlist, 10);
playlist = likeSong(playlist, 2);
playlist = likeSong(playlist, 2);

const beforeRemove = playlist;
playlist = removeSong(playlist, 1);

console.log("До:");
printPlaylist(beforeRemove);
console.log("После:");
printPlaylist(playlist);
console.log("Лайков:", getTotalLikes(playlist));
