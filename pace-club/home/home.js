/* Pace Club — home page (Home + Maps + Groups). Map: Leaflet + OpenStreetMap, search: Nominatim, routes: OSM routing. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- icons ---------- */
  var ICONS = {
    home: '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
    users: '<path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.3M15 4.2a3.5 3.5 0 0 1 0 6.6"/>',
    search: '<path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    bell: '<path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 15 18 9zM10 20a2 2 0 0 0 4 0"/>',
    gear: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM9 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>',
    run: '<path d="M3 17c0-3 2-4.5 4-4.5l3-6 3 2 2 3c3 0 5 2 5 5v2H3z"/>',
    bike: '<path d="M6 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM6 14.5l4-7h5l3 7M10 7.5l2.5 7M9 6h3"/>',
    swim: '<path d="M3 17c2 0 2-1.5 4.5-1.5S10 17 12 17s2.5-1.5 4.5-1.5S19 17 21 17M3 12c2 0 2-1.5 4.5-1.5S10 12 12 12s2.5-1.5 4.5-1.5S19 12 21 12"/>',
    record: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5" fill="currentColor"/>',
    contact: '<path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6zM6 7H3M6 12H3M6 17H3M13 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8.5 17c.5-2.2 2.2-3.5 4.5-3.5s4 1.300 4.500 3.500"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    locate: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"/>',
    dir: '<path d="M12 3l9 9-9 9-9-9 9-9zM8 14v-3a1.500 1.500 0 0 1 1.500-1.500H15M13 7l2.500 2.500L13 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>',
    heart: '<path d="M20.800 4.600a5.500 5.500 0 0 0-7.800 0L12 5.700l-1.100-1.100a5.500 5.500 0 0 0-7.800 7.800l1.100 1.100L12 21.200l7.700-7.700 1.100-1.100a5.500 5.500 0 0 0 0-7.800z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.540.54l3-3a5 5 0 0 0-7.070-7.070l-1.720 1.710M14 11a5 5 0 0 0-7.540-.54l-3 3a5 5 0 0 0 7.070 7.070l1.710-1.710"/>',
    image: '<path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.500 10a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3zM21 15l-5-5L5 21"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
    minus: '<path d="M5 12h14"/>',
    pin: '<path d="M12 21s-7-6.200-7-11a7 7 0 1 1 14 0c0 4.800-7 11-7 11zM12 12.500a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5z"/>'
  };
  function icon(n, s) { return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>'; }
  function paintIcons(root) { $$('[data-i]', root).forEach(function (el) { el.innerHTML = icon(el.dataset.i, +el.dataset.s || 22); }); }
  paintIcons();

  var toastEl = $('#toast'), tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('on'); }, 2800); }

  /* ---------- shell: views + tabs ---------- */
  var shell = $('#shell');
  var views = { home: $('#v-home'), maps: $('#v-maps'), groups: $('#v-groups') };
  var tabs = $$('.tab');

  function moveInk() {
    var t = $('.tab[aria-current="page"]'), n = $('.tab-ink');
    if (!t || !n) return;
    n.style.setProperty('--x', t.offsetLeft + 'px');
    n.style.setProperty('--w', t.offsetWidth + 'px');
  }
  function show(v) {
    Object.keys(views).forEach(function (k) { views[k].dataset.pos = k === v ? 'active' : 'off'; });
    tabs.forEach(function (t) { if (t.dataset.view === v) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current'); });
    moveInk();
    if (v === 'maps') Maps.open();
  }
  window.addEventListener('resize', moveInk);
  window.addEventListener('load', moveInk);

  function setUser(name) {
    var ini = name.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
    $$('[data-name]').forEach(function (e) { e.textContent = name; });
    $$('[data-initial]').forEach(function (e) { e.textContent = ini; });
  }

  document.addEventListener('click', function (e) {
    var v = e.target.closest('[data-view]');
    if (v) show(v.dataset.view);
    var a = e.target.closest('[data-act]');
    if (a) {
      var act = a.dataset.act;
      if (act === 'logout') { Pace.logout(); Pace.go('../index.html', 'back'); }
      else if (act === 'maps') show('maps');
      else if (act === 'find') { $('#f-q').focus(); }
      else toast('This is a demo, so that part isn’t connected yet.');
    }
  });

  /* friends (sample data) */
  var FR = [['Mika Santos', 1], ['Jules Rivera', 3], ['Ana Dela Cruz', 0], ['Theo Park', 2], ['Lena Okafor', 1], ['Marco Reyes', 4], ['Sofia Lim', 0], ['Kai Tan', 2]];
  var PAL = ['#FC4C02', '#2D6A9F', '#6B4EA0', '#1F8A70', '#C2415D', '#8A6D1F'];
  function renderFriends(q) {
    q = (q || '').toLowerCase();
    var list = FR.filter(function (f) { return f[0].toLowerCase().indexOf(q) > -1; });
    $('#f-count').textContent = list.length + (list.length === 1 ? ' friend' : ' friends');
    $('#f-list').innerHTML = list.length ? list.map(function (f, i) {
      var ini = f[0].split(' ').map(function (w) { return w.charAt(0); }).join('');
      var m = f[1] ? f[1] + ' mutual friend' + (f[1] > 1 ? 's' : '') : 'No mutual friends';
      return '<li><span class="av sm" style="background:' + PAL[(FR.indexOf(f)) % PAL.length] + '">' + esc(ini) + '</span><div><b>' + esc(f[0]) + '</b><small>' + m + '</small></div></li>';
    }).join('') : '<li class="f-empty">No friends match your search.</li>';
  }
  $('#f-q').addEventListener('input', function (e) { renderFriends(e.target.value); });
  renderFriends('');

  /* ---------- Maps ---------- */
  var Maps = (function () {
    var map, tiles, layerKey = 'map', resLayer, selMarker, meMarker, routeLayer, userLL, selected, ctl, timer, ready = false;
    var panel = $('#m-panel'), input = $('#m-q'), list = $('#m-res'), card = $('#m-place');
    var LAYERS = {
      map: ['Map', 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' }],
      sat: ['Satellite', 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles © Esri' }],
      terrain: ['Terrain', 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '© OpenTopoMap, © OpenStreetMap contributors' }]
    };
    var PIN = function (w) { return L.divIcon({ className: '', iconSize: [w, w * 1.33], iconAnchor: [w / 2, w * 1.33],
      html: '<svg class="pin" viewBox="0 0 24 32" width="' + w + '" height="' + w * 1.33 + '"><path d="M12 1C5.900 1 1 5.900 1 12c0 8.500 11 19 11 19s11-10.500 11-19C23 5.900 18.100 1 12 1z" fill="#FC4C02" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4.500" fill="#fff"/></svg>' }); };

    function init() {
      if (ready) return true;
      if (!window.L) { toast('The map library couldn’t load. Check your internet connection.'); return false; }
      map = L.map('map', { zoomControl: false }).setView([14.5995, 120.9842], 12);
      map.attributionControl.setPosition('bottomleft');
      setLayer('map');
      resLayer = L.layerGroup().addTo(map);
      ready = true;
      locate(true);
      return true;
    }
    function setLayer(k) {
      layerKey = k;
      if (tiles) map.removeLayer(tiles);
      tiles = L.tileLayer(LAYERS[k][1], LAYERS[k][2]).addTo(map);
    }
    function locate(silent) {
      if (!navigator.geolocation) { if (!silent) toast('Location isn’t available in this browser.'); return; }
      navigator.geolocation.getCurrentPosition(function (p) {
        userLL = [p.coords.latitude, p.coords.longitude];
        var dot = L.divIcon({ className: '', html: '<span class="me"></span>', iconSize: [18, 18], iconAnchor: [9, 9] });
        if (meMarker) meMarker.setLatLng(userLL); else meMarker = L.marker(userLL, { icon: dot, interactive: false, keyboard: false }).addTo(map);
        if (silent) map.setView(userLL, 14); else map.flyTo(userLL, 16, { duration: 1.2 });
      }, function () { if (!silent) toast('Couldn’t get your location. Check your browser’s permission.'); }, { enableHighAccuracy: true, timeout: 10000 });
    }

    /* search */
    function query(q, bounded) {
      if (ctl) ctl.abort();
      ctl = new AbortController();
      var b = map.getBounds();
      var vb = [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()].join(',');
      var url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&q=' + encodeURIComponent(q) + '&viewbox=' + vb + (bounded ? '&bounded=1' : '');
      return fetch(url, { signal: ctl.signal, headers: { Accept: 'application/json' } }).then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); });
    }
    function title(p) { return (p.name || p.display_name.split(',')[0]).trim(); }
    function rest(p) { var parts = p.display_name.split(','); return parts.slice(p.name ? 1 : 1).join(',').trim(); }
    function openList(html) { list.innerHTML = html; list.classList.add('on'); }
    function closeList() { list.classList.remove('on'); }
    function run(q, bounded, fit) {
      q = q.trim();
      if (q.length < 2) { closeList(); return; }
      panel.classList.add('busy');
      query(q, bounded).then(function (res) {
        panel.classList.remove('busy');
        resLayer.clearLayers();
        if (!res.length) { openList('<li class="note">No places found. Try another search.</li>'); return; }
        openList(res.map(function (p, i) {
          return '<li><button data-i="' + i + '"><i>' + icon('pin', 20) + '</i><span><b>' + esc(title(p)) + '</b><small>' + esc(rest(p)) + '</small></span></button></li>';
        }).join(''));
        $$('button', list).forEach(function (b) { b.addEventListener('click', function () { choose(res[+b.dataset.i]); }); });
        if (fit) {
          var pts = res.map(function (p) { return [+p.lat, +p.lon]; });
          res.forEach(function (p) {
            L.marker([+p.lat, +p.lon], { icon: PIN(26) }).addTo(resLayer).on('click', function () { choose(p); });
          });
          map.flyToBounds(L.latLngBounds(pts), { padding: [60, 60], maxZoom: 16, duration: 1 });
        }
      }).catch(function (err) {
        if (err.name === 'AbortError') return;
        panel.classList.remove('busy');
        openList('<li class="note">Couldn’t reach the search service. Check your connection and try again.</li>');
      });
    }
    input.addEventListener('input', function () {
      panel.classList.toggle('has-q', !!input.value);
      clearTimeout(timer);
      timer = setTimeout(function () { if (input.value.trim().length >= 3) run(input.value, false, false); else closeList(); }, 500);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { clearTimeout(timer); run(input.value, false, true); }
      if (e.key === 'Escape') { closeList(); input.blur(); }
    });
    $('#m-go').addEventListener('click', function () { clearTimeout(timer); run(input.value, false, true); });
    $('#m-clear').addEventListener('click', function () {
      input.value = ''; panel.classList.remove('has-q'); closeList(); resLayer.clearLayers(); clearPlace(); input.focus();
    });
    $$('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        if (!init()) return;
        input.value = c.dataset.label; panel.classList.add('has-q'); run(c.dataset.q, true, true);
      });
    });

    /* place card + directions */
    function choose(p) {
      selected = { lat: +p.lat, lon: +p.lon, name: title(p), addr: rest(p) };
      closeList(); resLayer.clearLayers(); clearRoute();
      if (selMarker) map.removeLayer(selMarker);
      selMarker = L.marker([selected.lat, selected.lon], { icon: PIN(32) }).addTo(map);
      map.flyTo([selected.lat, selected.lon], Math.max(map.getZoom(), 16), { duration: 1.1 });
      input.value = selected.name; panel.classList.add('has-q');
      card.innerHTML = '<button class="x" aria-label="Close">' + icon('close', 18) + '</button><h3>' + esc(selected.name) + '</h3><p class="addr">' + esc(selected.addr) + '</p>' +
        '<div class="row2"><button class="pill solid" data-d="open">' + icon('dir', 16) + ' Directions</button></div>' +
        '<div class="route-box" id="rb"><div class="row2"><button class="pill on" data-m="foot">Walk</button><button class="pill" data-m="bike">Bike</button><button class="pill" data-m="car">Drive</button></div><p class="route-sum" id="rs"></p></div>';
      card.classList.add('on');
      $('.x', card).addEventListener('click', clearPlace);
      $('[data-d]', card).addEventListener('click', function () { $('#rb').classList.add('on'); route('foot'); });
      $$('[data-m]', card).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('[data-m]', card).forEach(function (x) { x.classList.toggle('on', x === b); });
          route(b.dataset.m);
        });
      });
    }
    function clearRoute() { if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; } }
    function clearPlace() {
      card.classList.remove('on'); clearRoute(); selected = null;
      if (selMarker) { map.removeLayer(selMarker); selMarker = null; }
    }
    function route(mode) {
      var rs = $('#rs');
      if (!userLL) { rs.textContent = 'Allow location access to get directions from where you are.'; locate(false); return; }
      rs.textContent = 'Finding the best route…';
      var srv = { foot: 'routed-foot', bike: 'routed-bike', car: 'routed-car' }[mode];
      var url = 'https://routing.openstreetmap.de/' + srv + '/route/v1/driving/' + userLL[1] + ',' + userLL[0] + ';' + selected.lon + ',' + selected.lat + '?overview=full&geometries=geojson';
      fetch(url).then(function (r) { return r.json(); }).then(function (d) {
        var r0 = d.routes && d.routes[0];
        if (!r0) throw new Error('none');
        clearRoute();
        var gj = r0.geometry;
        routeLayer = L.layerGroup([
          L.geoJSON(gj, { style: { color: '#fff', weight: 9, opacity: .95, lineCap: 'round' } }),
          L.geoJSON(gj, { style: { color: '#FC4C02', weight: 5, lineCap: 'round' } })
        ]).addTo(map);
        map.flyToBounds(L.geoJSON(gj).getBounds(), { padding: [70, 70], duration: 1 });
        var km = (r0.distance / 1000).toFixed(r0.distance < 10000 ? 1 : 0), min = Math.round(r0.duration / 60);
        var t = min >= 60 ? Math.floor(min / 60) + ' h ' + (min % 60) + ' min' : min + ' min';
        rs.innerHTML = '<b>' + t + '</b> · ' + km + ' km';
      }).catch(function () { rs.textContent = 'Couldn’t find a route. Try another travel mode.'; });
    }

    /* controls */
    $('#c-in').addEventListener('click', function () { if (map) map.zoomIn(); });
    $('#c-out').addEventListener('click', function () { if (map) map.zoomOut(); });
    $('#c-me').addEventListener('click', function () { if (init()) locate(false); });
    $('#c-layer').addEventListener('click', function () {
      if (!init()) return;
      var keys = Object.keys(LAYERS), next = keys[(keys.indexOf(layerKey) + 1) % keys.length];
      setLayer(next); toast(LAYERS[next][0] + ' view');
    });

    return { open: function () { if (init()) setTimeout(function () { map.invalidateSize(); }, 480); } };
  })();


  /* ---------- Feed: runners post runs, walks and errands; people like and copy links ---------- */
  var Feed = (function () {
    var KP = 'pace-posts', KL = 'pace-liked', KG = 'pace-gs-hidden', BATCH = 4;
    function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
    function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
    var mine = load(KP, []), liked = load(KL, []), shown = 0, loading = false;
    var root = $('#v-home'), list = $('#feed-list'), end = $('#feed-end'), form = $('#composer');
    var now = Date.now();

    // [friend index, type, km, minutes, caption, minutes ago, base likes]
    var SEED = [
      [0, 'Run', 5.2, 28, 'Easy loop before work. Legs felt light today!', 35, 12],
      [1, 'Walk', 3.1, 42, 'Sunset walk along the river with my dog.', 95, 24],
      [2, 'Errand', 1.8, 25, 'Walked to the market and back. Groceries on my back counts as strength training.', 180, 9],
      [3, 'Run', 10.0, 58, 'Long run Sunday. Negative split on the last 3 km!', 320, 41],
      [4, 'Walk', 4.5, 55, 'Lunch break walk. No phone, no stress.', 600, 17],
      [5, 'Run', 8.4, 47, 'Tempo intervals at the track. Felt it in the best way.', 900, 33],
      [6, 'Errand', 2.4, 30, 'Jogged to the post office to mail the club shirts.', 1300, 12],
      [7, 'Walk', 6.0, 80, 'Trail walk with the club. New route, great views.', 1700, 52],
      [0, 'Run', 3.0, 19, 'Recovery jog. Slow is smooth, smooth is fast.', 2400, 15],
      [3, 'Walk', 2.2, 30, 'Evening stroll after dinner.', 3000, 8],
      [5, 'Run', 21.1, 112, 'Half marathon done! My first one ever.', 4300, 128],
      [2, 'Errand', 0.9, 12, 'Quick dash to the pharmacy before closing.', 5200, 6]
    ];
    var seeds = SEED.map(function (s, i) {
      return { id: 's' + (i + 1), author: FR[s[0]][0], color: PAL[s[0] % PAL.length], type: s[1], km: s[2], min: s[3], text: s[4], ts: now - s[5] * 60000, base: s[6], seed: i + 3 };
    });
    function all() { return mine.slice().sort(function (a, b) { return b.ts - a.ts; }).concat(seeds); }

    /* route artwork for posts without a photo */
    function rng(seed) {
      var a = seed >>> 0;
      return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    }
    var COLORS = { Run: ['#FC4C02', '#6e1c00'], Walk: ['#1F8A70', '#0c3a2f'], Errand: ['#2D6A9F', '#12304c'] };
    function art(p) {
      var r = rng(p.seed * 7919 + 13), pts = [], n = 9, i, a0 = r() * 6.28, span = 4.2 + r() * 1.6;
      for (i = 0; i < n; i++) {
        var th = a0 + (i / (n - 1)) * span, rx = 105 + r() * 55, ry = 70 + r() * 40;
        pts.push([200 + rx * Math.cos(th), 150 + ry * Math.sin(th)]);
      }
      var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
      for (i = 1; i < n - 1; i++) {
        var mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
        d += 'Q' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
      }
      d += 'L' + pts[n - 1][0].toFixed(1) + ' ' + pts[n - 1][1].toFixed(1);
      var c = COLORS[p.type] || COLORS.Run, gid = 'g' + p.id;
      return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Route map"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs>' +
        '<rect width="400" height="300" fill="url(#' + gid + ')"/><path d="M0 100H400M0 200H400M133 0V300M266 0V300" stroke="#fff" stroke-opacity=".1" stroke-width="2"/>' +
        '<path d="' + d + '" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="' + pts[0][0].toFixed(1) + '" cy="' + pts[0][1].toFixed(1) + '" r="9" fill="#2ecc71" stroke="#fff" stroke-width="3"/>' +
        '<circle cx="' + pts[n - 1][0].toFixed(1) + '" cy="' + pts[n - 1][1].toFixed(1) + '" r="9" fill="#fff" stroke="#242428" stroke-width="3"/></svg>';
    }

    /* formatting */
    function ago(ts) {
      var m = Math.floor((Date.now() - ts) / 60000);
      if (m < 1) return 'Just now';
      if (m < 60) return m + ' min ago';
      if (m < 1440) return Math.floor(m / 60) + ' h ago';
      return Math.floor(m / 1440) + ' d ago';
    }
    function title(p) {
      var h = new Date(p.ts).getHours();
      return (h < 5 ? 'Night' : h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : h < 21 ? 'Evening' : 'Night') + ' ' + p.type;
    }
    function dur(m) { return m >= 60 ? Math.floor(m / 60) + 'h ' + Math.round(m % 60) + 'm' : Math.round(m) + ' min'; }
    function pace(p) {
      var x = p.min / p.km, m = Math.floor(x), s = Math.round((x - m) * 60);
      if (s === 60) { m++; s = 0; }
      return m + ':' + (s < 10 ? '0' : '') + s + ' /km';
    }
    function initials(n) { return n.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase(); }
    function likes(p) { return p.base + (liked.indexOf(p.id) > -1 ? 1 : 0); }

    function postEl(p) {
      var on = liked.indexOf(p.id) > -1, stats = '';
      if (p.km > 0) stats += '<div><small>Distance</small><b>' + p.km.toFixed(1) + ' km</b></div>';
      if (p.min > 0) stats += '<div><small>Time</small><b>' + dur(p.min) + '</b></div>';
      if (p.km > 0 && p.min > 0) stats += '<div><small>Pace</small><b>' + pace(p) + '</b></div>';
      var el = document.createElement('article');
      el.className = 'card post'; el.id = 'post-' + p.id; el.dataset.id = p.id;
      el.innerHTML =
        '<header class="p-head"><span class="av sm" style="background:' + p.color + '">' + esc(initials(p.author)) + '</span><div><b>' + esc(p.author) + '</b><small>' + esc(p.type) + ' · ' + ago(p.ts) + '</small></div>' +
        (p.mine ? '<button class="del" aria-label="Delete post">' + icon('trash', 18) + '</button>' : '') + '</header>' +
        '<div class="p-media" title="Double-click to like">' + (p.photo ? '<img alt="Photo from ' + esc(p.author) + '’s ' + esc(p.type.toLowerCase()) + '">' : art(p)) +
        '<span class="p-badge">' + esc(p.type) + '</span><span class="burst">' + icon('heart', 88).replace('fill="none"', 'fill="currentColor"') + '</span></div>' +
        (stats ? '<div class="p-stats">' + stats + '</div>' : '') +
        '<div class="p-body"><h3>' + esc(title(p)) + '</h3>' + (p.text ? '<p>' + esc(p.text) + '</p>' : '') + '</div>' +
        '<footer class="p-actions"><button class="act like" aria-pressed="' + on + '" aria-label="Like">' + icon('heart', 20) + '<span class="n">' + likes(p) + '</span></button>' +
        '<button class="act copy" aria-label="Copy link to this post">' + icon('link', 20) + '<span>Copy link</span></button></footer>';
      if (p.photo) $('.p-media img', el).src = p.photo;
      return el;
    }

    /* infinite scroll */
    function more() {
      var a = all();
      if (shown >= a.length) { end.textContent = 'You’re all caught up. Go for a run!'; return false; }
      a.slice(shown, shown + BATCH).forEach(function (p) { list.appendChild(postEl(p)); });
      shown = Math.min(a.length, shown + BATCH);
      end.textContent = shown >= a.length ? 'You’re all caught up. Go for a run!' : '';
      return true;
    }
    function check() {
      if (loading || shown >= all().length) return;
      if (end.getBoundingClientRect().top < root.clientHeight + 400) {
        loading = true; end.innerHTML = '<div class="spin"></div>';
        setTimeout(function () { more(); loading = false; check(); }, 450);
      }
    }
    var tick = false;
    root.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; check(); }); } }, { passive: true });

    /* like, copy link, delete */
    function setLike(id, force) {
      var el = $('#post-' + id), i = liked.indexOf(id), p = all().filter(function (x) { return x.id === id; })[0];
      if (!el || !p) return;
      if (force === true && i > -1) return;
      if (i > -1) liked.splice(i, 1); else liked.push(id);
      save(KL, liked);
      var b = $('.like', el);
      b.setAttribute('aria-pressed', liked.indexOf(id) > -1);
      $('.n', b).textContent = likes(p);
      b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    }
    function copy(id, btn) {
      var url = location.href.split('#')[0] + '#post-' + id;
      function done() {
        toast('Link copied to clipboard');
        var s = $('span', btn); s.textContent = 'Copied';
        setTimeout(function () { s.textContent = 'Copy link'; }, 1600);
      }
      function fallback() {
        var t = document.createElement('textarea');
        t.value = url; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast('Couldn’t copy. The link is ' + url); }
        t.remove();
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(done, fallback); else fallback();
    }
    var lastTap = 0, lastEl = null;
    list.addEventListener('click', function (e) {
      var post = e.target.closest('.post'); if (!post) return;
      var id = post.dataset.id;
      if (e.target.closest('.like')) return setLike(id);
      if (e.target.closest('.copy')) return copy(id, e.target.closest('.copy'));
      if (e.target.closest('.del')) {
        mine = mine.filter(function (p) { return p.id !== id; }); save(KP, mine); shown--;
        post.classList.add('gone'); setTimeout(function () { post.remove(); }, 300); toast('Post deleted');
        return;
      }
      var media = e.target.closest('.p-media');
      if (media) {
        var t = Date.now();
        if (lastEl === media && t - lastTap < 320) {
          setLike(id, true);
          var bu = $('.burst', media); bu.classList.remove('on'); void bu.offsetWidth; bu.classList.add('on');
          lastTap = 0;
        } else { lastTap = t; lastEl = media; }
      }
    });

    /* composer */
    var type = 'Run', photo = null, ta = $('#c-text'), kmI = $('#c-km'), minI = $('#c-min'), prev = $('#c-prev');
    form.addEventListener('focusin', function () { form.classList.add('open'); });
    $$('.chip-t', form).forEach(function (b) {
      b.addEventListener('click', function () { type = b.dataset.t; $$('.chip-t', form).forEach(function (x) { x.classList.toggle('on', x === b); }); });
    });
    $('#c-photo').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var im = new Image();
        im.onload = function () {
          var s = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas');
          c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          photo = c.toDataURL('image/jpeg', 0.78);
          prev.innerHTML = '<img alt="Selected photo" src="' + photo + '"><button type="button" aria-label="Remove photo">×</button>';
          prev.classList.add('on');
        };
        im.src = r.result;
      };
      r.readAsDataURL(f);
    });
    prev.addEventListener('click', function (e) {
      if (e.target.closest('button')) { photo = null; prev.innerHTML = ''; prev.classList.remove('on'); $('#c-photo').value = ''; }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = ta.value.trim(), km = Math.max(0, parseFloat(kmI.value) || 0), min = Math.max(0, parseFloat(minI.value) || 0);
      if (!text && !km && !min && !photo) { toast('Add a caption, distance or photo to post.'); ta.focus(); return; }
      var u = Pace.user();
      var p = { id: 'u' + Date.now(), author: (u && u.name) || 'ren teox', color: '#FC4C02', type: type, km: km, min: min, text: text, ts: Date.now(), base: 0, seed: Date.now() % 100000, photo: photo, mine: true };
      mine.unshift(p);
      if (!save(KP, mine)) { p.photo = null; save(KP, mine); if (photo) toast('Posted, but the photo was too big to keep after a reload.'); else toast('Posted to your feed'); }
      else toast('Posted to your feed');
      var el = postEl(p); el.classList.add('new'); list.insertBefore(el, list.firstChild); shown++;
      ta.value = ''; kmI.value = ''; minI.value = ''; photo = null; prev.innerHTML = ''; prev.classList.remove('on'); $('#c-photo').value = '';
      form.classList.remove('open'); if (document.activeElement) document.activeElement.blur();
      window.dispatchEvent(new CustomEvent('pace:posted', { detail: { id: p.id, title: title(p) } }));
    });

    /* Getting Started card can be hidden */
    var gs = $('#started');
    if (load(KG, false)) gs.style.display = 'none';
    $('#gs-hide').addEventListener('click', function () { save(KG, true); gs.classList.add('out'); setTimeout(function () { gs.style.display = 'none'; }, 300); });

    /* open a copied link: #post-ID scrolls to the post */
    function reveal(id) {
      var idx = all().map(function (p) { return p.id; }).indexOf(id);
      if (idx < 0) return;
      while (shown <= idx && more()) {}
      var el = $('#post-' + id);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('flash'); setTimeout(function () { el.classList.remove('flash'); }, 1900); }
    }
    function fromHash() { var m = /^#post-(.+)$/.exec(location.hash); if (m) { show('home'); reveal(m[1]); } }
    window.addEventListener('hashchange', fromHash);

    more(); check();
    function friendLike(id) {
      var p = mine.filter(function (x) { return x.id === id; })[0];
      if (!p) return false;
      p.base++; save(KP, mine);
      var el = $('#post-' + id);
      if (el) $('.n', $('.like', el)).textContent = likes(p);
      return true;
    }
    return { fromHash: fromHash, reveal: reveal, friendLike: friendLike, ago: ago };
  })();


  /* ---------- helpers for the modules below ---------- */
  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function ini(n) { return n.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase(); }

  /* ---------- People search (top bar magnifier) ---------- */
  var People = (function () {
    var EXTRA = [['Ria Mendoza', 3], ['Dev Patel', 0], ['Hana Sato', 2], ['Luca Moretti', 1], ['Priya Nair', 5], ['Omar Haddad', 0], ['Chloe Bennett', 2], ['Ben Alvarez', 1], ['Yuki Tanaka', 4], ['Nora Eriksen', 0]];
    var people = FR.concat(EXTRA).map(function (f, i) {
      return { name: f[0], mutual: f[1], color: PAL[i % PAL.length], user: f[0].toLowerCase().replace(/[^a-z]/g, '') };
    });
    var following = lsGet('pace-following', []), ul = $('#ps-list'), head = $('#ps-head'), input = $('#ps-q');
    function count() { $('#st-following').textContent = following.length; }
    function row(p) {
      var on = following.indexOf(p.name) > -1;
      return '<li><span class="av sm" style="background:' + p.color + '">' + esc(ini(p.name)) + '</span><div class="who"><b>' + esc(p.name) + '</b><small>@' + esc(p.user) + ' · ' +
        (p.mutual ? p.mutual + ' mutual friend' + (p.mutual > 1 ? 's' : '') : 'No mutual friends') + '</small></div>' +
        '<button class="fbtn" data-n="' + esc(p.name) + '" aria-pressed="' + on + '">' + (on ? 'Following' : 'Follow') + '</button></li>';
    }
    function render(q) {
      q = (q || '').trim().toLowerCase().replace(/^@/, '');
      var res = q ? people.filter(function (p) { return p.name.toLowerCase().indexOf(q) > -1 || p.user.indexOf(q) > -1; })
                  : people.filter(function (p) { return following.indexOf(p.name) < 0; }).slice(0, 6);
      head.textContent = q ? (res.length ? 'People' : '') : 'Suggested runners';
      ul.innerHTML = res.length ? res.map(row).join('') : '<li class="ps-empty">No runners found for “' + esc(q) + '”.</li>';
    }
    input.addEventListener('input', function () { render(input.value); });
    ul.addEventListener('click', function (e) {
      var b = e.target.closest('.fbtn'); if (!b) return;
      var n = b.dataset.n, i = following.indexOf(n);
      if (i > -1) following.splice(i, 1); else following.push(n);
      lsSet('pace-following', following);
      var on = i === -1;
      b.setAttribute('aria-pressed', on); b.textContent = on ? 'Following' : 'Follow';
      count(); toast(on ? 'You’re now following ' + n : 'Unfollowed ' + n);
    });
    count();
    return { render: render };
  })();

  /* ---------- Notifications (bell): friends liking your posts ---------- */
  var Notif = (function () {
    var KN = 'pace-notifs', items = lsGet(KN, null), filter = 'all', ul = $('#n-list'), badge = $('#n-badge'), bell = $('#bell-btn');
    if (!items) {
      items = [{ id: 'n0', kind: 'welcome', text: 'Welcome to Pace Club! Post a run, a walk or an errand and you’ll see who likes it here.', ts: Date.now(), read: false }];
      lsSet(KN, items);
    }
    function unread() { return items.filter(function (n) { return !n.read; }).length; }
    function paintBadge() { var u = unread(); badge.hidden = !u; badge.textContent = u > 9 ? '9+' : u; }
    function item(n) {
      var avatar = n.kind === 'welcome'
        ? '<span class="av sm" style="background:var(--orange-soft)"><img src="../runner.png" alt=""></span>'
        : '<span class="av sm" style="background:' + n.color + '">' + esc(ini(n.who)) + '</span><span class="react">' + icon('heart', 12).replace('fill="none"', 'fill="currentColor"') + '</span>';
      var text = n.kind === 'welcome' ? esc(n.text) : '<b>' + esc(n.who) + '</b> liked your <b>' + esc(n.title) + '</b>.';
      return '<li class="n-item' + (n.read ? ' read' : '') + '" data-id="' + n.id + '"><button><span class="n-av">' + avatar + '</span><span class="n-body">' + text + '<small>' + Feed.ago(n.ts) + '</small></span><span class="n-dot"></span></button></li>';
    }
    function render() {
      var list = filter === 'unread' ? items.filter(function (n) { return !n.read; }) : items;
      ul.innerHTML = list.length ? list.map(item).join('')
        : '<li class="pn-empty">' + (filter === 'unread' ? 'You’re all caught up.' : 'No notifications yet.<br>When someone likes your post, you’ll see it here.') + '</li>';
      paintBadge();
    }
    function add(n) {
      items.unshift(n); items = items.slice(0, 40); lsSet(KN, items);
      paintBadge();
      if ($('#p-notif').classList.contains('on')) render();
      bell.classList.remove('ring'); void bell.offsetWidth; bell.classList.add('ring');
      toast(n.who + ' liked your ' + n.title);
    }
    $('#n-readall').addEventListener('click', function () { items.forEach(function (n) { n.read = true; }); lsSet(KN, items); render(); });
    $$('.pn-tabs button').forEach(function (b) {
      b.addEventListener('click', function () { filter = b.dataset.f; $$('.pn-tabs button').forEach(function (x) { x.classList.toggle('on', x === b); }); render(); });
    });
    ul.addEventListener('click', function (e) {
      var li = e.target.closest('.n-item'); if (!li) return;
      var n = items.filter(function (x) { return x.id === li.dataset.id; })[0];
      if (!n) return;
      n.read = true; lsSet(KN, items); paintBadge();
      closePops(); show('home');
      if (n.postId) setTimeout(function () { Feed.reveal(n.postId); }, 200);
    });
    // when you post, a few friends like it after a short delay (demo of live notifications)
    window.addEventListener('pace:posted', function (e) {
      var d = e.detail, names = FR.map(function (f, i) { return [f[0], PAL[i % PAL.length]]; }).sort(function () { return Math.random() - .5; }).slice(0, 2 + (Math.random() < .5 ? 1 : 0));
      names.forEach(function (nm, i) {
        setTimeout(function () {
          if (!Feed.friendLike(d.id)) return;
          add({ id: 'n' + Date.now() + i, kind: 'like', who: nm[0], color: nm[1], postId: d.id, title: d.title, ts: Date.now(), read: false });
        }, 5000 + i * 6000 + Math.random() * 3000);
      });
    });
    paintBadge();
    return { render: render };
  })();

  /* ---------- popovers: one open at a time, click outside or Esc closes ---------- */
  var pops = {};
  $$('[data-pop]').forEach(function (b) { pops[b.dataset.pop] = { btn: b, el: $('#' + b.dataset.pop) }; });
  function closePops(except) {
    Object.keys(pops).forEach(function (k) {
      if (k !== except) { pops[k].el.classList.remove('on'); pops[k].btn.setAttribute('aria-expanded', 'false'); }
    });
  }
  function togglePop(id) {
    var p = pops[id], was = p.el.classList.contains('on');
    closePops();
    if (was) return;
    p.el.classList.add('on'); p.btn.setAttribute('aria-expanded', 'true');
    if (id === 'p-search') { input_reset(); }
    if (id === 'p-notif') Notif.render();
  }
  function input_reset() { var q = $('#ps-q'); q.value = ''; People.render(''); setTimeout(function () { q.focus(); }, 90); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pop]');
    if (b) { togglePop(b.dataset.pop); return; }
    if (!e.target.closest('.pop')) closePops();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePops(); });

  /* ---------- Mini note: goals, km and activities for today or this week ---------- */
  var Notes = (function () {
    var K = 'pace-notes', items = lsGet(K, []), scope = 'today';
    var ul = $('#note-list'), sum = $('#note-sum'), dateEl = $('#note-date'), inp = $('#note-in');
    function pad(n) { return n < 10 ? '0' + n : n; }
    function dayKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    function weekStart(d) { var x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
    function keyFor(s) { var n = new Date(); return s === 'today' ? dayKey(n) : dayKey(weekStart(n)); }
    function label() {
      var n = new Date();
      if (scope === 'today') return n.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
      var s = weekStart(n), e = new Date(s); e.setDate(s.getDate() + 6);
      var f = { day: 'numeric', month: 'short' };
      return 'Week of ' + s.toLocaleDateString(undefined, f) + ' – ' + e.toLocaleDateString(undefined, f);
    }
    function km(t) { var m = /(\d+(?:[.,]\d+)?)\s*km/i.exec(t); return m ? parseFloat(m[1].replace(',', '.')) : 0; }
    function current() { var k = keyFor(scope); return items.filter(function (i) { return i.scope === scope && i.key === k; }); }
    function render() {
      var list = current();
      dateEl.textContent = label();
      ul.innerHTML = list.length ? list.map(function (i) {
        return '<li class="nrow' + (i.done ? ' done' : '') + '" data-id="' + i.id + '"><button class="chk" aria-label="' + (i.done ? 'Mark as not done' : 'Mark as done') + '" aria-pressed="' + !!i.done + '">' + icon('check', 14) + '</button><span class="txt">' + esc(i.text) + '</span><button class="rm" aria-label="Delete note">' + icon('close', 14) + '</button></li>';
      }).join('') : '<li class="note-empty">Nothing here yet. Add a goal for ' + (scope === 'today' ? 'today' : 'this week') + '.</li>';
      var done = list.filter(function (i) { return i.done; }).length;
      var kd = 0, kt = 0; list.forEach(function (i) { var v = km(i.text); kt += v; if (i.done) kd += v; });
      sum.textContent = list.length ? done + ' of ' + list.length + ' done' + (kt ? ' · ' + kd.toFixed(1) + ' of ' + kt.toFixed(1) + ' km' : '') : '';
    }
    function persist() { lsSet(K, items.slice(-200)); }
    $$('.note-tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        scope = b.dataset.scope;
        $$('.note-tabs button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
        render();
      });
    });
    $('#note-add').addEventListener('submit', function (e) {
      e.preventDefault();
      var t = inp.value.trim(); if (!t) { inp.focus(); return; }
      items.push({ id: 'i' + Date.now(), text: t, done: false, scope: scope, key: keyFor(scope) });
      persist(); inp.value = ''; render(); ul.scrollTop = ul.scrollHeight; inp.focus();
    });
    ul.addEventListener('click', function (e) {
      var li = e.target.closest('.nrow'); if (!li) return;
      var it = items.filter(function (x) { return x.id === li.dataset.id; })[0]; if (!it) return;
      if (e.target.closest('.chk')) { it.done = !it.done; persist(); render(); }
      else if (e.target.closest('.rm')) { items = items.filter(function (x) { return x !== it; }); persist(); render(); }
    });
    render();
    return { render: render };
  })();

  /* ---------- start: show the signed-in user ---------- */
  var u = Pace.user();
  setUser(u && u.name ? u.name : 'ren teox');
  show('home');
  Feed.fromHash();
})();
