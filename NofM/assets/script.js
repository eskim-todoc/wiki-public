/* Auto RTT Viewer — UI helpers
 * - Theme toggle (Catppuccin Latte ↔ Mocha), persisted in localStorage.
 * - Sidebar hamburger for mobile.
 * - Mermaid theme sync.
 */
(function () {
  const STORAGE_KEY = 'arv-theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      const next = theme === 'mocha' ? 'latte' : 'mocha';
      btn.textContent = theme === 'mocha' ? 'Latte 모드' : 'Mocha 모드';
      btn.setAttribute('aria-label', '테마 전환 — 현재 ' + theme);
      btn.dataset.next = next;
    }
    if (window.__mermaidInit) {
      window.__mermaidInit(theme);
    }
  }

  function initialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'latte' || stored === 'mocha') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'mocha';
    }
    return 'latte';
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(initialTheme());

    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const next = root.getAttribute('data-theme') === 'mocha' ? 'latte' : 'mocha';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
      });
    }

    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('aside.sidebar');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (window.innerWidth <= 900 &&
            !sidebar.contains(e.target) &&
            !menuBtn.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      });
    }

    // Mark current TOC item based on filename
    const here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav.toc a').forEach(function (a) {
      const href = a.getAttribute('href') || '';
      if (href === here) a.classList.add('current');
    });
  });
})();
