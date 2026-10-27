/* Урок 13 · общий помощник страницы: автопроверка + вызов ваших функций из кнопок.
   Этот файл менять не нужно. */
(function () {
  const results = [];
  const cache = new WeakMap();
  const ARR = 'Код меняет исходный массив (push, pop, shift, unshift, splice, sort, reverse или arr[i] = …).';
  function mutation(what) { const e = new Error('Мутация! ' + what + ' Входные данные менять нельзя — верните новый массив/объект.'); e.isMutation = true; throw e; }
  function protect(x) {
    if (!x || typeof x !== 'object') return x;
    if (cache.has(x)) return cache.get(x);
    const p = new Proxy(x, {
      get: (t, k) => protect(t[k]),
      set: (t, k) => mutation(Array.isArray(t) ? ARR : 'Код меняет свойство «' + String(k) + '» исходного объекта.'),
      deleteProperty: (t, k) => mutation(Array.isArray(t) ? ARR : 'Код удаляет «' + String(k) + '» из исходного объекта.'),
      defineProperty: () => mutation('Код меняет исходные данные.'),
    });
    cache.set(x, p);
    return p;
  }
  const clone = (x) => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const fail = (msg) => { throw new Error(msg); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const taskNo = (name) => { const n = document.querySelector('[data-task="' + name + '"] .num'); return n ? ' Это задание ' + n.textContent + '.' : ''; };
  const missing = (name) => 'Функция ' + name + ' не найдена. Если вы её написали — откройте консоль (F12): там ошибка в коде.';
  const errText = (e) => (e.isMutation ? e.message : (e.constructor !== Error ? 'Ошибка в коде: ' + e.message : e.message));

  // Автопроверка одного задания
  window.check = function (fnName, run) {
    const fn = window[fnName];
    if (typeof fn !== 'function') { results.push({ fnName, status: 'wait', msg: missing(fnName) }); return; }
    try {
      const out = run(fn, { freeze: (x) => protect(clone(x)), same, fail });
      if (out === 'wait') results.push({ fnName, status: 'wait', msg: 'Ещё не написана: функция возвращает undefined. Нужен return.' });
      else results.push({ fnName, status: 'ok', msg: 'Готово! Проверка пройдена.' });
    } catch (e) {
      results.push({ fnName, status: 'bad', msg: errText(e) });
    }
  };

  window.reportChecks = function () {
    const icon = { ok: '✅', bad: '❌', wait: '⏳' };
    const ok = results.filter((r) => r.status === 'ok').length;
    console.log('%cПроверка: ' + ok + ' из ' + results.length, 'font-weight:bold;font-size:14px');
    results.forEach((r) => console.log(icon[r.status] + ' ' + r.fnName + ' — ' + r.msg));
    const score = document.getElementById('score');
    if (score) score.innerHTML = '<b>' + ok + '</b> / ' + results.length + ' готово';
    results.forEach((r) => {
      const card = document.querySelector('[data-task="' + r.fnName + '"]');
      if (!card) return;
      card.classList.remove('ok', 'bad', 'wait'); card.classList.add(r.status);
      card.querySelector('.badge').textContent = icon[r.status] + (r.status === 'ok' ? ' готово' : r.status === 'bad' ? ' ошибка' : ' не написано');
      card.querySelector('.check-msg').textContent = r.msg;
    });
  };

  // Вызов функции ученика из кнопки страницы. Возвращает { value } или { error, kind }
  window.callStudent = function (fnName, args, expect) {
    const fn = window[fnName];
    if (typeof fn !== 'function') return { kind: 'wait', error: missing(fnName) };
    let value;
    try { value = fn(...args.map((a) => protect(clone(a)))); } catch (e) { return { kind: 'bad', error: errText(e) }; }
    if (value === undefined) return { kind: 'wait', error: 'Кнопка пока не работает: ' + fnName + ' ещё пустая (возвращает undefined).' + taskNo(fnName) };
    value = clone(value);
    if (expect === 'array' && !Array.isArray(value)) return { kind: 'bad', error: fnName + ' должна вернуть массив.' };
    if (expect === 'array' && value.some((x) => x == null)) return { kind: 'bad', error: fnName + ' вернула массив с undefined. В map нужен return item для остальных элементов.' };
    if (expect === 'object' && (typeof value !== 'object' || Array.isArray(value))) return { kind: 'bad', error: fnName + ' должна вернуть объект.' };
    return { value };
  };

  // Строка статуса под магазином
  window.showStatus = function (res, okText) {
    const el = document.getElementById('status');
    if (!el) return;
    el.className = 'status ' + (res.error ? res.kind : 'ok');
    el.innerHTML = res.error ? (res.kind === 'wait' ? '⏳ ' : '❌ ') + esc(res.error) : '✅ ' + esc(okText);
  };
  window.esc = esc;
})();
