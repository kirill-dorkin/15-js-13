// Плеер на странице. Кнопки вызывают функции из script.js. Этот файл менять не нужно.
(function () {
  let list = [
    { id: 1, title: "Gulzada", artist: "Mirbek", likes: 12, saved: false },
    { id: 2, title: "Night City", artist: "Nova", likes: 40, saved: true },
    { id: 3, title: "Ala-Too", artist: "Aibek", likes: 7, saved: false },
  ];
  let conf = { theme: "dark", player: { volume: 50, shuffle: false } };
  let nextId = 4;

  function render() {
    document.getElementById('playlist').innerHTML = list.length ? list.map((s) =>
      '<div class="row"><div class="grow"><strong>' + esc(s.title) + '</strong><small>' + esc(s.artist) + ' · id ' + s.id + '</small></div>' +
      '<button data-act="like" data-id="' + s.id + '">♥ ' + s.likes + '</button>' +
      '<button class="ghost" data-act="save" data-id="' + s.id + '" title="Сохранить">' + (s.saved ? '★' : '☆') + '</button>' +
      '<button class="ghost" data-act="remove" data-id="' + s.id + '">✕</button></div>').join('')
      : '<div class="empty">Плейлист пуст</div>';
    const v = conf && conf.player ? conf.player.volume : '?';
    document.getElementById('volume').textContent = v;
    document.getElementById('volumeRange').value = Number(v) || 0;
  }

  document.querySelector('.app').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const id = Number(b.dataset.id), act = b.dataset.act;
    let res, text;
    if (act === 'add') {
      const input = document.getElementById('newTitle');
      const title = input.value.trim();
      if (!title) { showStatus({ kind: 'wait', error: 'Введите название песни.' }); input.focus(); return; }
      const song = { id: nextId, title, artist: "Вы", likes: 0, saved: false };
      res = callStudent('addSong', [list, song], 'array');
      text = 'addSong(playlist, «' + title + '») — песня добавлена.';
      if (!res.error) { list = res.value; nextId++; input.value = ''; }
    } else if (act === 'remove') {
      res = callStudent('removeSong', [list, id], 'array'); text = 'removeSong(playlist, ' + id + ') — песня удалена.';
      if (!res.error) list = res.value;
    } else if (act === 'like') {
      res = callStudent('likeSong', [list, id], 'array'); text = 'likeSong(playlist, ' + id + ') — +1 лайк.';
      if (!res.error) list = res.value;
    } else if (act === 'save') {
      res = callStudent('toggleSaved', [list, id], 'array'); text = 'toggleSaved(playlist, ' + id + ') — переключено.';
      if (!res.error) list = res.value;
    }
    showStatus(res, text);
    render();
  });
  document.getElementById('newTitle').addEventListener('keydown', (e) => { if (e.key === 'Enter') document.querySelector('[data-act=add]').click(); });
  document.getElementById('volumeRange').addEventListener('change', (e) => {
    const volume = Number(e.target.value);
    const res = callStudent('setVolume', [conf, volume], 'object');
    if (!res.error && !(res.value.player && typeof res.value.player === 'object')) { res.error = 'setVolume потеряла объект player. Не забудьте ...settings.'; res.kind = 'bad'; }
    if (!res.error) conf = res.value;
    showStatus(res, 'setVolume(settings, ' + volume + ') — громкость ' + volume + '.');
    render();
  });
  render();
})();
