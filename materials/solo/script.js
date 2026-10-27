// ═════════════════════════════════════════════
//  Урок 13 · Плейлист
//  Весь код страницы здесь. Вы пишете только раздел 2.
// ═════════════════════════════════════════════


// ─── 1. ДАННЫЕ ───────────────────────────────

let playlist = [
  { id: 1, title: "Gulzada", likes: 12 },
  { id: 2, title: "Night City", likes: 40 },
  { id: 3, title: "Ala-Too", likes: 7 },
];

let oldPlaylist = playlist;                  // плейлист до последнего нажатия
let playlistText = JSON.stringify(playlist); // снимок — чтобы заметить, если его испортили
let nextId = 4;


// ─── 2. ВАШИ ФУНКЦИИ ─────────────────────────
// Правило: старый плейлист НЕ меняем. Возвращаем НОВЫЙ.

// «Добавить»: новый плейлист + song в конце
function addSong(playlist, song) {

}

// «✕»: новый плейлист без песни с этим id
function removeSong(playlist, id) {

}

// «♥»: новый плейлист, где у песни с этим id likes + 1
function likeSong(playlist, id) {

}


// ─── 3. КНОПКИ ───────────────────────────────
// Нажали кнопку → вызвали вашу функцию → получили новый плейлист.

function clickAdd() {
  const input = document.querySelector("#title");
  const title = input.value.trim();
  if (title === "") {
    showMessage("Введите название песни.", "");
    return;
  }
  const song = { id: nextId, title: title, likes: 0 };
  if (save(addSong(playlist, song))) {
    nextId = nextId + 1;
    input.value = "";
  }
}

function clickRemove(id) {
  save(removeSong(playlist, id));
}

function clickLike(id) {
  save(likeSong(playlist, id));
}

// Запоминаем новый плейлист и проверяем, что старый не испорчен
function save(newPlaylist) {
  if (newPlaylist === undefined) {
    showMessage("⏳ Функция пока пустая — нужен return.", "");
    return false;
  }

  oldPlaylist = playlist;
  playlist = newPlaylist;

  if (oldPlaylist === newPlaylist) {
    showMessage("❌ Вернулся ТОТ ЖЕ массив. Нужен новый: [...playlist], filter или map.", "bad");
  } else if (JSON.stringify(oldPlaylist) !== playlistText) {
    showMessage("❌ Старый плейлист изменился — это мутация. Посмотрите на «Было».", "bad");
  } else if (newPlaylist.includes(undefined)) {
    showMessage("❌ В новом плейлисте undefined — в map нужно вернуть и остальные песни.", "bad");
  } else {
    showMessage("✅ Получили новый плейлист. Старый не изменился.", "ok");
  }
  playlistText = JSON.stringify(playlist);
  render();
  return true;
}


// ─── 4. ПОКАЗ НА ЭКРАНЕ ──────────────────────

function showPlaylist(list, withButtons) {
  if (list.length === 0) {
    return `<div class="empty">Пусто</div>`;
  }
  return list.map((song) => {
    if (song === undefined) {
      return `<div class="row bad">undefined — в map забыли вернуть песню</div>`;
    }
    const buttons = withButtons
      ? `<button onclick="clickLike(${song.id})">♥ ${song.likes}</button>
         <button onclick="clickRemove(${song.id})">✕</button>`
      : `<small>♥ ${song.likes}</small>`;
    return `<div class="row"><span>${song.title}</span>${buttons}</div>`;
  }).join("");
}

function render() {
  document.querySelector("#before").innerHTML = showPlaylist(oldPlaylist, false);
  document.querySelector("#after").innerHTML = showPlaylist(playlist, true);
}

function showMessage(text, type) {
  const box = document.querySelector("#message");
  box.textContent = text;
  box.className = type;
}

document.querySelector("#addButton").addEventListener("click", clickAdd);
render();
showMessage("Нажмите любую кнопку.", "");
