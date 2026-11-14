/* Pace Club — shared helpers: sample-account session, page-to-page transitions, button ripple. */
(function () {
  'use strict';
  var KEY = 'pace-user', root = document.documentElement;

  function store() {
    try { localStorage.setItem('_t', '1'); localStorage.removeItem('_t'); return localStorage; }
    catch (e) { return sessionStorage; }
  }

  // Entry animation: slide in from the side we navigated from, or fade.
  var dir = null;
  try { dir = sessionStorage.getItem('pace-dir'); sessionStorage.removeItem('pace-dir'); } catch (e) {}
  root.classList.add('enter-' + (dir === 'fwd' || dir === 'back' ? dir : 'fade'));

  window.Pace = {
    user: function () { try { return JSON.parse(store().getItem(KEY)); } catch (e) { return null; } },
    login: function (name) { try { store().setItem(KEY, JSON.stringify({ name: name })); } catch (e) {} },
    logout: function () { try { store().removeItem(KEY); } catch (e) {} },
    // Navigate to another page with a smooth slide-out. dir: 'fwd' | 'back'
    go: function (url, d) {
      d = d || 'fwd';
      try { sessionStorage.setItem('pace-dir', d); } catch (e) {}
      root.classList.remove('enter-fwd', 'enter-back', 'enter-fade');
      root.classList.add('leave-' + d);
      setTimeout(function () { location.href = url; }, 380);
    }
  };

  // Coming back via the browser's back button: undo the leaving state.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) root.classList.remove('leave-fwd', 'leave-back');
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.btn');
    if (b && !b.classList.contains('loading')) {
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = document.createElement('span');
      s.className = 'ripple';
      s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(s);
      setTimeout(function () { s.remove(); }, 600);
    }
    var n = e.target.closest('[data-nav]');
    if (n) { e.preventDefault(); Pace.go(n.dataset.nav, n.dataset.dir); }
  });
})();
