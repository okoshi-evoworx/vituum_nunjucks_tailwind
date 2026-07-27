import collapsiblePanel from './modules/collapsiblePanel.js';
import menu from './modules/menu.js';
import preventPageLoadTransitions from './modules/preventPageLoadTransitions.js';
import tabInit from './modules/tabInit.js';

// ページロード時のtransition除去
preventPageLoadTransitions();
document.addEventListener('DOMContentLoaded', () => {
  menu();
  collapsiblePanel();
  tabInit();
});
