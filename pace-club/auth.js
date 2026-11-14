/* Pace Club — index.html: welcome, log in and sign up screens with slide transitions.
   On success the sample account is saved and we move on to home.html. */
(function () {
  'use strict';
  var screens = {};
  document.querySelectorAll('.screen').forEach(function (s) { screens[s.id] = s; });
  var active = document.querySelector('.screen[data-pos="active"]');
  var current = active ? active.id : 'welcome', busy = false;
  var depth = { welcome: 0, login: 1, signup: 1 };

  // Optional deep links: index.html#login or index.html#signup open that screen directly.
  var wanted = location.hash.slice(1);
  if ((wanted === 'login' || wanted === 'signup') && screens[wanted]) {
    [screens.welcome, screens[wanted]].forEach(function (s) { s.style.transition = 'none'; });
    screens.welcome.dataset.pos = 'left';
    screens[wanted].dataset.pos = 'active';
    current = wanted;
    void screens[wanted].offsetWidth;
    [screens.welcome, screens[wanted]].forEach(function (s) { s.style.transition = ''; });
  }

  // Slide between screens on the same page.
  function go(to) {
    if (!screens[to] || to === current || busy) return;
    busy = true;
    var from = screens[current], next = screens[to], forward = depth[to] > depth[current] || (current === 'login' && to === 'signup');
    next.style.transition = 'none';
    next.dataset.pos = forward ? 'right' : 'left';
    void next.offsetWidth;
    next.style.transition = '';
    from.classList.add('hiding');
    from.dataset.pos = forward ? 'left' : 'right';
    next.dataset.pos = 'active';
    next.scrollTop = 0;
    current = to;
    setTimeout(function () {
      from.classList.remove('hiding');
      busy = false;
      var f = next.querySelector('input');
      if (f && window.matchMedia('(hover:hover)').matches) f.focus({ preventScroll: true });
    }, 560);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go],[data-back]');
    if (t) { e.preventDefault(); go(t.dataset.go || t.dataset.back); }
    var sh = e.target.closest('.show');
    if (sh) {
      var i = sh.parentNode.querySelector('input'), show = i.type === 'password';
      i.type = show ? 'text' : 'password';
      sh.textContent = show ? 'Hide' : 'Show';
      sh.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    }
  });

  function setBad(el, bad) {
    var f = el.closest('.field');
    if (f) f.classList.toggle('bad', bad);
    el.setAttribute('aria-invalid', bad);
  }

  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('input', function (e) { setBad(e.target, false); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null, isSignup = form.dataset.form === 'signup';
      form.querySelectorAll('input[required],select[required]').forEach(function (el) {
        var v = el.type === 'checkbox' ? el.checked : el.value.trim();
        var bad = !v;
        if (!bad && el.type === 'email') bad = !/^\S+@\S+\.\S+$/.test(v);
        if (!bad && isSignup) {
          if (el.name === 'pw') bad = v.length < 8;
          if (el.name === 'pw2') bad = v !== form.elements.pw.value;
        }
        setBad(el, bad);
        if (bad) { ok = false; if (!first) first = el; }
      });
      if (!ok) { first.focus(); return; }

      var btn = form.querySelector('.btn');
      btn.classList.add('loading'); btn.disabled = true;

      // TODO: replace this timeout with your real login / sign-up request.
      setTimeout(function () {
        Pace.login(isSignup ? form.elements.name.value.trim() : 'ren teox'); // login uses a sample account
        Pace.go('home/home.html', 'fwd');
      }, 1000);
    });
  });
})();
