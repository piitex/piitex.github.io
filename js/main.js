(function () {
  document.documentElement.classList.add('js');

  // ---------- Top bar: border on scroll, mobile menu (the bar itself comes from layout.js) ----------
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Scroll reveal ----------
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- Home page: showcase tabs (the big animations load the first time their tab is opened) ----------
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.id.replace('tab-', '');
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', String(on));
      });
      document.querySelectorAll('.panel').forEach(function (p) {
        var on = p.id === 'panel-' + key;
        p.hidden = !on;
        p.classList.toggle('active', on);
      });
      document.querySelectorAll('.stage img').forEach(function (img) {
        var on = img.id === 'img-' + key;
        if (on && img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
        img.classList.toggle('on', on);
      });
    });
  });
  // Warm the other animations once the page is idle
  if (tabs.length && 'requestIdleCallback' in window) {
    window.addEventListener('load', function () {
      requestIdleCallback(function () {
        document.querySelectorAll('.stage img[data-src]').forEach(function (img) {
          var pre = new Image(); pre.src = img.dataset.src;
        });
      }, { timeout: 4000 });
    });
  }

  // ---------- Code colouring ----------
  // Write plain code inside <code class="language-java"> (or language-json) and it is coloured here.
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function span(cls, text) { return cls ? '<span class="' + cls + '">' + esc(text) + '</span>' : esc(text); }

  var KEYWORDS = {};
  ('abstract assert boolean break byte case catch char class continue default do double else enum extends final ' +
   'finally float for if implements import instanceof int interface long new null package private protected public ' +
   'record return short static super switch this throw throws try var void while true false').split(' ')
    .forEach(function (k) { KEYWORDS[k] = true; });

  // comment | string | annotation | number | identifier (+ "(" if it is a call)
  var JAVA_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])')|(@[A-Za-z_]\w*)|(\b\d[\d_]*(?:\.\d+)?[fFdDlL]?\b)|([A-Za-z_]\w*)(\s*\()?/g;
  function highlightJava(src) {
    var out = '', last = 0, m;
    JAVA_RE.lastIndex = 0;
    while ((m = JAVA_RE.exec(src))) {
      out += esc(src.slice(last, m.index));
      last = JAVA_RE.lastIndex;
      if (m[5]) {
        var w = m[5], cls = null;
        if (KEYWORDS[w]) cls = 'k';
        else if (/^[A-Z][A-Z0-9_]+$/.test(w)) cls = 'n';   // CONSTANTS
        else if (/^[A-Z]/.test(w)) cls = 't';              // Types
        else if (m[6]) cls = 'f';                          // method calls
        out += span(cls, w) + esc(m[6] || '');
      } else {
        out += span(m[1] ? 'c' : m[2] ? 's' : m[3] ? 'f' : 'n', m[0]);
      }
    }
    return out + esc(src.slice(last));
  }

  var JSON_RE = /("(?:\\.|[^"\\\n])*")(\s*:)?|(-?\b\d+(?:\.\d+)?\b)|\b(true|false|null)\b/g;
  function highlightJson(src) {
    var out = '', last = 0, m;
    JSON_RE.lastIndex = 0;
    while ((m = JSON_RE.exec(src))) {
      out += esc(src.slice(last, m.index));
      last = JSON_RE.lastIndex;
      if (m[1]) out += span(m[2] ? 't' : 's', m[1]) + esc(m[2] || '');
      else out += span(m[3] ? 'n' : 'k', m[0]);
    }
    return out + esc(src.slice(last));
  }

  document.querySelectorAll('code[class*="language-"]').forEach(function (el) {
    var src = el.textContent;
    if (el.classList.contains('language-java')) el.innerHTML = highlightJava(src);
    else if (el.classList.contains('language-json')) el.innerHTML = highlightJson(src);
  });

  // ---------- Copy buttons ----------
  document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.dataset.copy);
      if (!target) return;
      var text = target.innerText;
      var done = function () {
        var old = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = old; }, 1500);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done);
    });
  });

  // ---------- Sticky section chips (Features and Code pages): highlight the section you are reading ----------
  var chipNav = document.querySelector('.chipnav');
  if (chipNav && 'IntersectionObserver' in window) {
    var chips = {};
    chipNav.querySelectorAll('a[href^="#"]').forEach(function (a) { chips[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(chips).forEach(function (id) { chips[id].classList.toggle('active', id === en.target.id); });
        var chip = chips[en.target.id];
        var box = chipNav.querySelector('.chips');
        if (chip && box) {
          box.scrollTo({ left: chip.offsetLeft - box.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-30% 0px -65% 0px' });
    Object.keys(chips).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }
})();
