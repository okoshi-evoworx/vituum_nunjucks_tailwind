export default function tabInit () {
  if (!(document.querySelector('[role="tab"]') && document.querySelector('[role="tablist"]'))) return

  const tabs = document.querySelectorAll('[role="tab"]')
  const tabLists = document.querySelectorAll('[role="tablist"]')

  tabs.forEach(tab => {
    tab.addEventListener('click', changeTabs)

    // アンカーリンク付きアクセス時
    window.addEventListener('load', ()=>{
      const hash = location.hash.replace('#', '')
      const controls = tab.getAttribute('aria-controls')
      if (hash && controls && hash.startsWith(controls)) {
        tab.click()
      }
    })
  })


  let tabFocus = 0

  // キーボードでのタブ切り替え (左右キー) 39:← 37:→
  tabLists.forEach(tabList => {
    tabList.addEventListener('keydown', e => {
      if (e.keyCode === 39 || e.keyCode === 37) {
        tabs[tabFocus].setAttribute('tabindex', -1)
        if (e.keyCode === 39) {
          tabFocus++
          if (tabFocus >= tabs.length) {
            tabFocus = 0
          }
        } else if (e.keyCode === 37) {
          tabFocus--
          if (tabFocus < 0) {
            tabFocus = tabs.length - 1
          }
        }
        tabs[tabFocus].setAttribute('tabindex', 0)
        tabs[tabFocus].focus()
      }
    })
  })

  // タブ切り替え
  function changeTabs (e) {
    const target = e.target.closest('button')
    const targetList = target.closest('[role="tablist"]')
    const tabPanels = targetList.nextElementSibling || targetList.parentNode.nextElementSibling
    const tabMore = document.querySelector('[data-tab-more]') // TOPページのMoreボタン

    targetList.querySelectorAll('[aria-selected="true"]').forEach(t => {
      t.setAttribute('aria-selected', false)
    })
    target.setAttribute('aria-selected', true)

    tabPanels.querySelectorAll('[role="tabpanel"]').forEach(p => {
      p.setAttribute('hidden', true)
    })

    const selectedTab = tabPanels.querySelector(`#${target.getAttribute('aria-controls')}`)
    selectedTab.removeAttribute('hidden')
    selectedTab.closest('.c-tabs').scrollIntoView({ block: 'start' });
  }
}
