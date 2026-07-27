/*
<details class="c-collapsible-panel">
  <summary>
    <h3>タイトル</h3>
    <span class="icon"></span>
  </summary>
  <div class="wrapper">
    <div class="body">
      <p>内容</p>
    </div>
  </div>
</details>
*/
export default () => {
  if (!document.querySelector('.c-collapsible-panel')) return
  const collapsibelPanels = document.querySelectorAll('.c-collapsible-panel')
  for (const collapsiblePanel of collapsibelPanels) {

    const PANEL = {
      DETAILS: collapsiblePanel,
      TOGGLE: collapsiblePanel.querySelector('summary'),
      BUSY: false
    }

    PANEL.TOGGLE.addEventListener('click', (e) => {
      e.preventDefault()
      if (PANEL.BUSY) return

      if(PANEL.DETAILS.open) {
        PANEL.BUSY = true
        PANEL.DETAILS.classList.remove('is-open');
        PANEL.DETAILS.addEventListener('transitionend', ()=> {
          PANEL.DETAILS.removeAttribute('open');
          PANEL.BUSY = false;
        }, { once: true })
      } else {
        PANEL.BUSY = true
        PANEL.DETAILS.setAttribute('open','true');
        // openが付いてから実行
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            PANEL.DETAILS.classList.add('is-open');
            PANEL.DETAILS.addEventListener('transitionend', ()=> {
              PANEL.BUSY = false;
            }, { once: true })
          });
        });
      }
    })

    if (PANEL.DETAILS.id) {
      // アンカー付きでアクセスされたら開く
      window.addEventListener('load', ()=>{
        if(location.hash.replace('#','') === PANEL.DETAILS.id) {
          if (!PANEL.DETAILS.getAttribute('open')) {
            PANEL.BUSY = true
            PANEL.DETAILS.setAttribute('open','true');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                PANEL.DETAILS.classList.add('is-open');
                PANEL.DETAILS.addEventListener('transitionend', ()=> {
                  PANEL.BUSY = false;
                }, { once: true })
              });
            });
          }
        }
      })
    }
  }
}