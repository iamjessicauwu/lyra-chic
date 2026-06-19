// Initialize Rave framework
import Lyra, { Security } from "./Lyra_UI/js/main.js";

const lyra = Lyra ? new Lyra("1.0", "Nathania Anneta") : null;
const security = Security ? new Security('1.0', "Lyra") : null;

lyra.setHeadTagType("icon", "/assets/logo/lyra.png");

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const isMobile = /Mobi|Android|iPhone|iPod|iPad|BlackBerry|IEMobile/i.test(navigator.userAgent);
        
        if (isMobile) {
            navigator.serviceWorker.register('/sw.js')
           .then(reg => console.log('Service Worker registered!', reg))
           .catch(err => console.log('Service Worker registration failed:', err));
        } else {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    lyra.setHeadTagType("script", [
        "https://unpkg.com/lenis@1.3.20/dist/lenis.min.js"
    ])
    lyra.setHeadTagType("stylesheet", "https://unpkg.com/lenis@1.3.20/dist/lenis.css");
    
    var Lenis = window.Lenis;
    const lenis = new Lenis({
        duration: 2,
        smooth: true,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        autoRaf: true,
    })

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    lenis.scrollTo(0, { immediate: true });

    let lastDirection = 0;
    
    lenis.on('scroll', (e) => {
        const header = document.querySelector('.header-container');
        const footer = document.querySelector('footer');

        const offsetTop = footer.offsetTop;
        const innerHeight = window.innerHeight;

        const direction = e.direction;
        if (Math.abs(e.velocity) < 0.4) return;

        if (direction !== 0) {
            lastDirection = direction;
            header.classList.toggle('hide', direction === 1);
        }
        const reachFooter = e.scroll + innerHeight >= offsetTop + 400;
        if (reachFooter) {
            header.classList.add('hide');
        }

    })

    const root = document.documentElement;
    
    const isAnimEnabled = localStorage.getItem('anim-mode') === 'enabled';
    if (isAnimEnabled) { 
        document.body.classList.add('anim-disabled');
    }
    
    window.showTab = showTab;

    function showTab(tab) {
        const tabEl = document.getElementById(tab);
        if (!tabEl) return;

        const group = tabEl.closest('.tab-container');
        if (!group) return;
        

        const tabs =  group.querySelectorAll(`.tab-content`);
        const buttons = group.querySelectorAll(`.tab-button`);

        tabs.forEach(tab => tab.classList.remove('active'));
        buttons.forEach(button => button.classList.remove('active'));

        tabEl.classList.add('active');
        const targetEl = group.querySelector(`#${tab}-tab`);
        if (targetEl) {
            targetEl.classList.add('active');
        }
    }

    // Initialize the elements on the page.
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('draggable', 'false')
    })

    const dataTitle = document.body.getAttribute('data-title');
    if (dataTitle) {
        document.title = dataTitle + ' - Lyra Chic';
    }
})

