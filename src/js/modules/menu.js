/**
 * ハンバーガーメニュー（Modal）
 *
 * Dialog(Modal) Pattern | APG
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 * Inertについて
 * https://web.dev/articles/inert?hl=ja
 * フォーカストラップについて
 * https://azukiazusa.dev/blog/fucus-trap-accessible-modal/
 *
 */
export default () => {
  if (!(document.getElementById('header') && document.getElementById('menu') && document.getElementById('trigger'))) return;
  const header = document.getElementById('header');
  const menu = document.getElementById('menu');
  const trigger = document.getElementById('trigger');
  const main = document.getElementById('main') || '';
  const footer = document.getElementById('footer') || '';
  const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, [tabindex]:not([tabindex^="-"]), [contenteditable]';
  const mql = window.matchMedia('(width < 800px)');
  let previousScrollY = 0;

  // ヘッダーの高さを--header-heightに格納
  // const getHeaderHeight = () => {
  //   const headerResizeObserver = new ResizeObserver((entries) => {
  //     for (const entry of entries) {
  //       if (entry.borderBoxSize) {
  //         document.documentElement.style.setProperty('--header-height', `${entry.borderBoxSize[0].blockSize}px`);
  //       }
  //     }
  //   });
  //   headerResizeObserver.observe(header);
  // };
  // getHeaderHeight();

  // フォーカストラップ
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      menuClose();
      return;
    }
    if (e.key === 'Tab') {
      const focusableElements = header.querySelectorAll(focusableSelector);
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }

      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  // メニューを開く
  const menuOpen = () => {
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-selected', 'true');
    trigger.setAttribute('aria-label', 'メニューを閉じる');
    menu.setAttribute('aria-hidden', 'false');
    menu.removeAttribute('inert');
    main?.setAttribute('inert', '');
    footer?.setAttribute('inert', '');
    previousScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${previousScrollY}px`;
    document.addEventListener('keydown', handleKeyDown);
    document.documentElement.classList.add('dialog-open');
    // header.querySelectorAll(focusableSelector)[0].focus();
  };

  // メニューを閉じる
  const menuClose = () => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-selected', 'false');
    trigger.setAttribute('aria-label', 'メニューを開く');
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('inert', '');
    main?.removeAttribute('inert');
    footer?.removeAttribute('inert');
    document.body.removeAttribute('style');
    window.scrollTo(0, previousScrollY);
    document.removeEventListener('keydown', handleKeyDown);
    document.documentElement.classList.remove('dialog-open');
  };

  const triggerClick = () => {
    if (trigger.getAttribute('aria-expanded') === 'true') {
      menuClose();
    } else {
      menuOpen();
    }
  }

  const documentClick = (e) => {
    if (e.target === menu) {
      menuClose()
    }
  }


  // スマホ・PC切替
  const menuInit = (mql) => {
    if (mql.matches) { // スマホ
      menuClose()
      menu.setAttribute('inert', '')
      menu.setAttribute('role', 'dialog')
      trigger.addEventListener('click', triggerClick)
      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', menuClose)
      })
      document.addEventListener('click', documentClick)
    } else { // PC
      menuClose()
      trigger.removeEventListener('click', triggerClick)
      menu.querySelectorAll('a').forEach((link) => {
        link.removeEventListener('click', menuClose)
      })
      menu.setAttribute('aria-hidden', 'false')
      menu.removeAttribute('inert')
      menu.removeAttribute('role')
      document.removeEventListener('click', documentClick)
    }
  }
  menuInit(mql);
  mql.addEventListener('change', menuInit);



};
