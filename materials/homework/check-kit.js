/* Мини-автопроверка. Данные защищены: если функция меняет входные данные — проверка это увидит. */
(function () {
  const results = [];
  const cache = new WeakMap();
  const ARR = 'Код меняет исходный массив (push, pop, shift, unshift, splice, sort, reverse или arr[i] = …).';
  function mutation(what) { const e = new Error('Мутация! ' + what + ' Входные данные менять нельзя — создайте новый массив/объект.'); e.isMutation = true; throw e; }
  function protect(x) {
    if (!x || typeof x !== 'object') return x;
    if (cache.has(x)) return cache.get(x);
    const p = new Proxy(x, {
      get: (t, k) => protect(t[k]),
      set: (t, k) => mutation(Array.isArray(t) ? ARR : 'Код меняет свойство «' + String(k) + '» исходного объекта.'),
      deleteProperty: (t, k) => mutation(Array.isArray(t) ? ARR : 'Код удаляет «' + String(k) + '» из исходного объекта.'),
      defineProperty: (t, k) => mutation('Код меняет исходные данные.'),
    });
    cache.set(x, p);
    return p;
  }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function fail(msg) { throw new Error(msg); }

  window.check = function (title, fnName, run) {
    const fn = window[fnName];
    if (typeof fn !== 'function') { results.push({ status: 'wait', title, msg: 'Функция ' + fnName + ' не найдена. Если она написана — в консоли есть ошибка синтаксиса (SyntaxError).' }); return; }
    try {
      const out = run(fn, { freeze: (x) => protect(clone(x)), same, fail });
      if (out === 'wait') results.push({ status: 'wait', title, msg: 'Функция пока возвращает undefined — допишите return.' });
      else results.push({ status: 'ok', title, msg: out || '' });
    } catch (e) {
      const msg = e.isMutation ? e.message : (e instanceof Error && !(e.constructor === Error) ? 'Ошибка в коде: ' + e.message : e.message);
      results.push({ status: 'bad', title, msg });
    }
  };

  window.reportChecks = function () {
    const icon = { ok: '✅', bad: '❌', wait: '⏳' };
    const ok = results.filter((r) => r.status === 'ok').length;
    console.log('%cПроверка: ' + ok + ' из ' + results.length, 'font-weight:bold;font-size:14px');
    results.forEach((r) => console.log(icon[r.status] + ' ' + r.title + (r.msg ? ' — ' + r.msg : '')));
    const box = document.getElementById('checks');
    if (!box) return;
    box.innerHTML = '<div class="score">' + ok + ' / ' + results.length + '</div>' + results.map((r) =>
      '<div class="check ' + r.status + '"><b>' + icon[r.status] + '</b><div><strong>' + r.title + '</strong>' + (r.msg ? '<p>' + r.msg.replace(/</g, '&lt;') + '</p>' : '') + '</div></div>').join('');
  };
})();
