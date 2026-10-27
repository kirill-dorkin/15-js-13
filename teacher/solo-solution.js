// Решение · Сами: плейлист
function addSong(playlist, song) {
  return [...playlist, song];
}

function removeSong(playlist, id) {
  return playlist.filter((song) => song.id !== id);
}

function likeSong(playlist, id) {
  return playlist.map((song) =>
    song.id === id ? { ...song, likes: song.likes + 1 } : song
  );
}
