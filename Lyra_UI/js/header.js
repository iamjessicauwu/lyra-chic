const url = './elements/header.html';
// Disable Lenis scrolling in modals or side panel
const sidePanels = document.querySelectorAll('.side-panel, .nav-pane, dialog');
for (const panel of sidePanels) {
    panel.setAttribute('data-lenis-prevent', 'true')
}

fetch(url).then(response => response.text()).then(html => { document.querySelector('header').innerHTML = html; }).finally(() => {
    function switchTab(tab) {
        const tabEl = document.querySelector(`.tab-index[data-tab="${tab}"]`);
        if (!tabEl) return;

        const group = tabEl.closest('.tab-content');
        if (!group) return;

        const tabs = group.querySelectorAll(`.tab-index`);
        const buttons = group.querySelectorAll(`.tab-btn`);
        
        tabs.forEach(tabItem => tabItem.classList.remove('active'));
        buttons.forEach(button => button.classList.remove('active'));

        tabEl.classList.add('active');
        const targetEl = group.querySelector(`.tab-btn[data-tab-target="${tab}"]`);
        if (targetEl) {
            targetEl.classList.add('active');
        }
    }

    const tabButtons = document.querySelectorAll(`.tab-btn[data-tab-target]`);
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tabTarget));
    });

    const input = document.getElementById('search-input');
    const suggested = document.querySelector('.suggested-search');
    input.addEventListener('input', (e) => {
        if (e.target.value === '' || e.target.value === null) { suggested.classList.remove('hidden') } else { suggested.classList.add('hidden') }
    });
    const navBtns = document.querySelectorAll('.navigation .navBtn');
    const currentPath = window.location.pathname;

    navBtns.forEach(btn => {
        const a = btn.querySelector('a');
        if (!a) return;

        const href = a.getAttribute('href');

        if (currentPath === href) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    })
    let element = document.querySelectorAll('[data-tooltip]');

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    document.body.appendChild(tooltip);
    
    element.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            tooltip.textContent = elem.dataset.tooltip || 'No tooltip text';
            tooltip.style.display = 'block';
            tooltip.style.left = '-9999px';
            tooltip.style.top = '-9999px';
            
            requestAnimationFrame(() => {
                const rect = elem.getBoundingClientRect();
                let left = rect.left + window.scrollX;
                let top = rect.top + window.scrollY - tooltip.offsetHeight - 12;
                left += (rect.width - tooltip.offsetWidth) / 2;
                
                if (top < window.scrollY) {
                    top = rect.bottom + window.scrollY + 15;
                }

                if (left < window.scrollX) {
                    left += rect.left + window.scrollX + 50;
                } 
    
                const maxRight = window.scrollX + window.innerWidth;
                const rightEdge = left + tooltip.offsetWidth;
                
                if (rightEdge > maxRight) {
                    left = maxRight - tooltip.offsetWidth - 35;
                }
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`

            })


        })

        elem.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
        
        elem.addEventListener('touchmove', () => {
            tooltip.style.display = "none";
        })
        
    })


    const btns = document.querySelectorAll('.navBtn');
    const pops = document.querySelectorAll('.drop-down');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const rect = btn.getBoundingClientRect();
    
            pops.forEach(pop => {
                pop.style.left = rect.left + 'px';
                pop.style.top = rect.bottom + 'px';

                const popRect = pop.getBoundingClientRect();
                if (popRect.right > window.innerWidth) {
                    const right = rect.right - popRect.width;
                    pop.style.left = right + 'px';
                }
            })
        })

    })

    const searchBtns = document.querySelectorAll('.searchBtn');
    let inputs = document.querySelectorAll('.search-text');
    const prevText = document.querySelector('.prev-search-text');

    searchBtns.forEach((searchBtn) => {
        searchBtn.addEventListener('click', (event) => { 
            event.preventDefault();

            const hasEmpty = Array.from(inputs).filter(input => input.offsetParent !== null && !input.disabled && !input.classList.contains('disabled'))
            const query = hasEmpty[0]?.value.trim() || '';

            if (!query) {
                alert('Please enter a search term');
                return;
            } 
            window.location.href = `./result.html?search=${encodeURIComponent(query)}`;
            prevText.innerHTML = query;
            

        });
    })
    const header = document.querySelector('.header-container');
    const navpane = document.querySelector('.nav-pane');
    const hamburger = '.hamburger';
    const overlay = document.querySelector('.overlay');
    const menuButtons = document.querySelectorAll('.menuButton');

    function initializeNavPane(hamburger) {
        const hamburgers = document.querySelectorAll(hamburger);

        hamburgers.forEach(btn => {
            function openNavPane() {
                btn.classList.add('active');
                
                requestAnimationFrame(() => { 
                    navpane.style.animation = `fadeIn .4s ease-in-out`;
                    btn.classList.add('no-pointer');
                    navpane.classList.remove('hidden');
                    header.classList.add('transparent');   
        
                    navpane.addEventListener('animationend', () => {
                        if (navpane.style.animation.includes('fadeIn')) {
                            btn.classList.remove('no-pointer');
                        }
                    }, {once: true} );
                });
            }
        
            function closeNavPane() {
                btn.classList.add('no-pointer');
                btn.classList.add('active');
                
                requestAnimationFrame(() => {
                    btn.classList.remove('active');
                    navpane.style.animation = `fadeOut .5s ease-in-out`;
                    
                    navpane.addEventListener('animationend', () => {
                        if (navpane.style.animation.includes('fadeOut')) {
                            navpane.classList.add('hidden');
                            btn.classList.remove('no-pointer');
                            header.classList.remove('transparent');   
                        }
                    }, {once: true});
                });
                
            }
        
            function toggleNavPane() {
                if (navpane.classList.contains('hidden')) {
                    openNavPane();
                } else {
                    closeNavPane();
                }
            }

            btn.addEventListener('click', toggleNavPane);
        })
    }
    
    initializeNavPane(hamburger);
    
    const body = document.body;

    window.addEventListener('scroll', () => {
        body.scrollTop > 200 || document.documentElement.scrollTop > 100 ? document.querySelector('.header-container').classList.add('scrolled') : document.querySelector('.header-container').classList.remove('scrolled');
    })

    function disableAnimation(checkbox) {
        const cbx = document.querySelector(checkbox);
        const isAnimEnabled = localStorage.getItem('anim-mode') === 'enabled';
        
        if (isAnimEnabled) {
            document.body.classList.add('anim-disabled');
            cbx.checked = true;
        }
        else {
            document.body.classList.remove('anim-disabled');
            cbx.checked = false;
            localStorage.setItem("anim-mode", "disabled");
        }
        
        cbx.addEventListener('change', () => {
            if (cbx.checked) {
                document.body.classList.add('anim-disabled');
                cbx.checked = true;
                localStorage.setItem("anim-mode", "enabled");
            }
            else {
                document.body.classList.remove('anim-disabled');
                cbx.checked = false;
                localStorage.setItem("anim-mode", "disabled");
            }
        })
    }

    const dsbAnim = '#dsbAnimCbx';
    disableAnimation(dsbAnim);

    const dyslexiaCbx = document.getElementById('dyslexiaCbx');
    if (!dyslexiaCbx) return;

    const dyslexiaState = localStorage.getItem('dyslexia') === 'true';

    document.body.classList.toggle('dyslexia', dyslexiaState);
    dyslexiaCbx.checked = dyslexiaState;

    dyslexiaCbx.addEventListener('change', () => {
        const enabled = dyslexiaCbx.checked;

        document.body.classList.toggle('dyslexia', enabled);
        localStorage.setItem('dyslexia', enabled);
    })
    
    const hc = document.getElementById('contrastCbx');
    if (!hc) return;

    const hcState = localStorage.getItem('hc') === 'true';

    document.body.classList.toggle('high-contrast', hcState);
    hc.checked = hcState;

    hc.addEventListener('change', () => {
        const enabled = hc.checked;
    
        document.body.classList.toggle('high-contrast', enabled);
        localStorage.setItem('hc', enabled);
    })
})
