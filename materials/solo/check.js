// Автопроверка заданий. Этот файл менять не нужно.
(function () {
  const LIST = [{ id: 1, title: "Gulzada", artist: "Mirbek", likes: 12, saved: false }, { id: 2, title: "Night City", artist: "Nova", likes: 40, saved: true }, { id: 3, title: "Ala-Too", artist: "Aibek", likes: 7, saved: false }];
  const SETTINGS = { theme: "dark", player: { volume: 50, shuffle: false } };
  const SONG = { id: 4, title: "Tengri", artist: "Bek", likes: 0, saved: false };

  check('addSong', (fn, t) => {
    const p = t.freeze(LIST), res = fn(p, t.freeze(SONG));
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.length !== 4 || res[3].id !== 4) t.fail('Ожидалось 4 песни, новая — последней.');
  });
  check('removeSong', (fn, t) => {
    const res = fn(t.freeze(LIST), 1);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || !t.same(res.map((s) => s && s.id), [2, 3])) t.fail('Должны остаться песни с id 2 и 3.');
  });
  check('likeSong', (fn, t) => {
    const p = t.freeze(LIST), res = fn(p, 3);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.length !== 3) t.fail('Нужен массив той же длины.');
    if (res.includes(undefined)) t.fail('В массиве undefined: в map нужен return song для остальных.');
    if (res[2].likes !== 8) t.fail('У Ala-Too должно стать 8 лайков, сейчас ' + res[2].likes + '.');
    if (res[2] === p[2]) t.fail('Изменённая песня должна быть новым объектом: { ...song, likes: … }.');
    if (res[0] !== p[0]) t.fail('Остальные песни возвращаем как есть.');
  });
  check('toggleSaved', (fn, t) => {
    const p = t.freeze(LIST), res = fn(p, 2);
    if (res === undefined) return 'wait';
    if (!Array.isArray(res) || res.includes(undefined)) t.fail('Нужен массив без undefined.');
    if (res[1].saved !== false) t.fail('У Night City saved должно стать false.');
    if (fn(t.freeze(res), 2)[1].saved !== true) t.fail('Повторное нажатие должно вернуть saved: true.');
  });
  check('setVolume', (fn, t) => {
    const s = t.freeze(SETTINGS), res = fn(s, 80);
    if (res === undefined) return 'wait';
    if (!res.player || res.player.volume !== 80) t.fail('player.volume должно стать 80.');
    if (res.player === s.player) t.fail('player — та же ссылка. Скопируйте и вложенный объект: player: { ...settings.player, volume }.');
    if (res.player.shuffle !== false || res.theme !== 'dark') t.fail('Остальные настройки потерялись — не забудьте spread.');
  });
  reportChecks();
})();
