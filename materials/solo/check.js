const LIST = [{ id: 1, title: "Gulzada", artist: "Mirbek", likes: 12, saved: false }, { id: 2, title: "Night City", artist: "Nova", likes: 40, saved: true }, { id: 3, title: "Ala-Too", artist: "Aibek", likes: 7, saved: false }];
const SETTINGS = { theme: "dark", player: { volume: 50, shuffle: false } };
const SONG = { id: 4, title: "Tengri", artist: "Bek", likes: 0, saved: false };

check('1. addSong', 'addSong', (fn, t) => {
  const p = t.freeze(LIST), res = fn(p, t.freeze(SONG));
  if (res === undefined) return 'wait';
  if (res === p) t.fail('Вернулся тот же массив.');
  if (!Array.isArray(res) || res.length !== 4 || res[3].id !== 4) t.fail('Ожидалось 4 песни, новая — последней.');
  if (!t.same(p, LIST)) t.fail('Исходный плейлист изменился.');
});

check('2. removeSong', 'removeSong', (fn, t) => {
  const p = t.freeze(LIST), res = fn(p, 1);
  if (res === undefined) return 'wait';
  if (!t.same(res.map((s) => s.id), [2, 3])) t.fail('Должны остаться id 2 и 3. Сейчас: ' + JSON.stringify(res.map((s) => s && s.id)));
  if (res === p) t.fail('Вернулся тот же массив.');
});

check('3. likeSong', 'likeSong', (fn, t) => {
  const p = t.freeze(LIST), res = fn(p, 3);
  if (res === undefined) return 'wait';
  if (res.includes(undefined)) t.fail('В массиве undefined: в map нужен return item для остальных.');
  if (res[2].likes !== 8) t.fail('У песни 3 должно стать 8 лайков, сейчас ' + res[2].likes + '.');
  if (res[2] === p[2]) t.fail('Изменённая песня должна быть новым объектом.');
  if (res[0] !== p[0]) t.fail('Неизменённые песни возвращаем как есть.');
});

check('4. toggleSaved', 'toggleSaved', (fn, t) => {
  const p = t.freeze(LIST), res = fn(p, 2);
  if (res === undefined) return 'wait';
  if (res[1].saved !== false) t.fail('У песни 2 saved должно стать false.');
  const back = fn(res, 2);
  if (back[1].saved !== true) t.fail('Повторный вызов должен вернуть saved: true.');
  if (p[1].saved !== true) t.fail('Исходный плейлист изменился.');
});

check('5. Бонус: setVolume', 'setVolume', (fn, t) => {
  const s = t.freeze(SETTINGS), res = fn(s, 80);
  if (res === undefined) return 'wait';
  if (res === s) t.fail('Вернулся тот же объект settings.');
  if (!res.player || res.player.volume !== 80) t.fail('player.volume должно стать 80.');
  if (res.player === s.player) t.fail('player — та же ссылка. Скопируйте и вложенный объект: player: { ...settings.player, volume }.');
  if (res.player.shuffle !== false || res.theme !== 'dark') t.fail('Остальные настройки потерялись — не забудьте spread.');
  if (s.player.volume !== 50) t.fail('Исходные настройки изменились.');
});

reportChecks();
