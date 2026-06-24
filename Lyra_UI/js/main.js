/// <reference lib="dom" />

export default class Lyra {
    constructor(version, author) {
        this.version = version;
        this.author = author;
    }

    /**
     * @param {"script" | "stylesheet" | "icon" | "preload" | "lite"} type - Type of head tag to set.
     * @param {Array} paths - Path to the resource file (JS, CSS, icon, etc.), depending on the type. Throw error if the path isn't valid for the specified type.
     * @version 1.2
     */
    setHeadTagType(type, paths = []) {
        const head = document.head;
        if (!Array.isArray(paths)) paths = [paths];

        paths.forEach(path => {
            if (type === "script") {
                const script = document.createElement("script");
                script.defer = false;
                script.src = path;
                head.appendChild(script);
            }
            else if (type === "stylesheet") {
                const style = document.createElement("link");
                style.rel = "stylesheet";
                style.href = path;
                head.appendChild(style);
            }
            else if (type === "icon") {
                const icon = document.createElement("link");
                icon.rel = "icon";
                icon.href = path;
                head.appendChild(icon);
            }
            else if (type === "preload") {
                const preload = document.createElement("link");
                preload.rel = "preload";
                preload.href = path;
                preload.as = detectPath(path);

                if (preload.as === 'font') {
                    preload.crossOrigin = 'anonymous';
                }
                head.appendChild(preload);
            } else if (type === "lite") {
                const lite = document.createElement("link");
                lite.rel = 'stylesheet';
                lite.href = path;
                lite.media = 'print';
                lite.onload = () => {
                    lite.media = 'all';
                }
            }

            else {
                throw new Error(`Unknown type: ${type}`);
            }
        })

        function detectPath(path) {
            const str = path.split('.').pop().split('?')[0].toLowerCase();

            if (str === 'css' || path.includes('fonts.googleapis.com')) return 'style';
            if (str === 'js') return 'script';
            if (['woff', 'woff2', 'ttf', 'otf'].includes(str)) return 'font';
            if (['jpg', 'jpeg', 'png', 'tiff', 'webp', 'gif', 'svg'].includes(str)) return 'image';
            if (['mp4', '.webm', '.ogg'].includes(str)) return 'video';

            return 'fetch';
        }
    }

    /**
     * @param {string} elemTarget - Target element selector such as header, footer, div, etc.
     * @param {string} url - URL of the HTML file to fetch and insert it into the target element.
     * @summary Fetch an external HTML file and insert its content into a target page element.
     * @version 1.0
     */
    fetchElement(elemTarget, url) {
        try { fetch(url).then(response => { if (response.ok) { response => response.text(); } else { throw new Error("Can't fetch the response."); } }).finally(data => { document.querySelector(elemTarget).innerHTML = data; }); } catch (err) { console.error("Error:", err) }
    }

    /**
     * 
     * @param {*} elements - list of elements to apply Windows 10-style tilt effect
     * @summary Add Windows 10-style tilt effect to specified elements when clicked and dragged.
     * @version 1.1 - Fixed incorrect rotate direction. 
     */
    addTiltEffect(elements) {
        const elems = document.querySelectorAll(elements);
        elems.forEach(elem => {
            elem.style.transformStyle = 'preserve-3d';
            elem.addEventListener('mousedown', (e) => {
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = -(y - centerY) / 10;
                const rotateY = (x - centerX) / 10;

                elem.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.97)`; elem.style.transition = 'transform .1s cubic-bezier(0.075, 0.82, 0.165, 1)';
            });
            elem.addEventListener('mouseleave', () => {
                elem.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            });
            elem.addEventListener('mouseup', () => {
                elem.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });
    }

    /**
     * @param {*} scrollableElement - Scrollable element selector such as div, body, main, etc.
     * @param {*} floatButtonId - ID of the floating button element
     * @summary Add "scroll to top" functionality to a scrollable element with a floating button in bottom corner of the screen.
     * @version 1.0
     */
    scrollToTop(scrollableElement, floatButtonId) {
        let elem = document.querySelector(scrollableElement);
        let floatBtn = document.getElementById(floatButtonId);
        elem.addEventListener('scroll', () => {
            elem.scrollTop >= 80 ? floatBtn.classList.remove('hidden') : floatBtn.classList.add('hidden');
        });
        floatBtn.addEventListener('click', () => {
            elem.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    loadElementSequentially(elements) {
        const elems = document.querySelectorAll(elements);
        elems.forEach((el, index) => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'opacity .6s ease, transform .6s';
                el.style.opacity = 1;
                el.style.transform = 'translateY(0)';
            }, index * 200);
        })
    }

    animateOnScroll(selector, options = {}) {
        const {
            target = null,
            animationClass = 'visible',
            stagger = 0,
            threshold = 0.5,
            once = true

        } = options;

        const elements = document.querySelectorAll(selector);
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;

                if (target) {
                    const items = el.querySelectorAll(target);

                    items.forEach((item, i) => {
                        if (stagger) {
                            item.style.transitionDelay = `${i * stagger}s`;
                        }
                        item.classList.add(animationClass);

                    });
                } else {
                    el.classList.add(animationClass);
                }

                if (once) {
                    obs.unobserve(el);
                }
            });
        }, { threshold, rootMargin: '0px 0px -10% 0px' });

        elements.forEach(el => observer.observe(el));
    }

    initDynamicElementScroll(selector, options = {}) {
        const {
            minValue = 0,
            maxValue = 60,
            threshold = 100,
            offset = 0.2,
            isTopAndBottomPaddingIncluded = false
        } = options;

        const elements = document.querySelectorAll(selector);
        const top = document.documentElement.scrollTop || document.body.scrollTop;

        elements.forEach(element => {
            const customThreshold = parseInt(element.dataset.threshold) || threshold;

            if (window.innerWidth < 768) {
                element.style.padding = "0px";
                return;
            }

            let paddingValue = maxValue;

            if (top > customThreshold) {
                paddingValue = Math.max(minValue, maxValue - ((top - customThreshold) * offset));
            }

            element.style.padding = `0px ${paddingValue}px`;
        })
    }

    intersectElements(parentContainer, childElements, transformType, delay = 50) {
        const elements = document.querySelectorAll(childElements);
        const parent = document.querySelectorAll(parentContainer);

        const allElements = [...elements, ...parent];
        const position = allElements.map(el => ({
            el,
            top: el.getBoundingClientRect().top
        }))
        requestAnimationFrame(() => {
            elements.forEach(el => { el.style.pointerEvents = 'none'; });
            position.sort((a, b) => a.top - b.top);

            const all = position.map(item => item.el);
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    setTimeout(() => {
                        if (transformType === 'translate') {
                            entry.target.style.transform = 'translate(0px, 0px)';
                        } else if (transformType === 'translateY') {
                            entry.target.style.transform = 'translateY(0px)';
                        } else if (transformType === 'translateX') {
                            entry.target.style.transform = 'translateX(0px)';
                        } else if (transformType === 'scaleTranslateX') {
                            entry.target.style.transform = 'scale(1) translateX(0px)';
                        } else if (transformType === 'scaleTranslateY') {
                            entry.target.style.transform = 'scale(1) translateY(0px)';
                        } else if (transformType === 'scale') {
                            entry.target.style.transform = 'scale(1)';
                        } else {
                            entry.target.style.transform = 'translate(0px, 0px)';
                        }

                        entry.target.style.opacity = 1;
                        entry.target.style.visibility = 'visible';
                        entry.target.style.pointerEvents = 'auto';

                        observer.unobserve(entry.target);
                    }, delay);
                    delay += 50;
                });


                if (delay > 1000) { console.warn('Warning: Card animation delay exceeds 1 second, this may cause performance issues on low-end devices.'); }
            }, { rootMargin: '-10% 0px -10% 0px' });

            all.forEach(el => observer.observe(el));
        })



    }

    /**
     * @param {string} json Set the JSON files that be used for carousel caption content.
     * @version 1.1
     */
    setCarousel(options = {}) {
        const {
            json = '',
            title,
            subtitle,
            newsType,
            track,
            indicators,
            prev,
            next,
        } = options;

        let currentIndex = 0;
        let slidesData = [];
        let slides = [];
        let indicatorsArray = [];
        let startX = 0;
        let endX = 0;

        function handleMove(e) {
            e.preventDefault();

            if (e.type === 'mousedown') {
                startX = e.clientX;
            }
            else if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
            }


            endX = startX;


        }
        function handleEnd(e) {
            if (e.type === 'mouseup') {
                endX = e.clientX;
            } else if (e.type === "touchend") {
                endX = e.changedTouches[0].clientX;
            }

            const x = startX - endX;

            if (Math.abs(x) > 50) {
                if (x > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }

            startX = 0;
            endX = 0;
        }

        async function initCarousel() {
            try {
                const response = await fetch(json);
                slidesData = await response.json();

                renderSlides();
                updateCarousel();
            } catch (err) {
                console.error('Failed to load news:', err);
            }
        }

        function renderSlides() {
            slidesData.forEach((slide, index) => {
                const slideEl = document.createElement('div');
                slideEl.classList.add('slide');

                slideEl.style.backgroundImage = `url(${slide.image})`;
                slideEl.style.backgroundSize = 'cover';
                slideEl.style.backgroundPosition = 'center';

                track.appendChild(slideEl);

                slideEl.addEventListener('mousedown', handleMove, false);
                slideEl.addEventListener('touchstart', handleMove, false);
                slideEl.addEventListener('mouseup', handleEnd, false);
                slideEl.addEventListener('touchend', handleEnd, false);

                const dot = document.createElement('div');
                dot.classList.add('indicator');
                if (index === 0) dot.classList.add('active');

                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });

                indicators.appendChild(dot);
            });

            slides = document.querySelectorAll('.slide');
            indicatorsArray = document.querySelectorAll('.indicator');
        }

        function updateCarousel() {
            setTimeout(() => {
                track.style.transform = `translateX(-${currentIndex * 100}vw)`;

                indicatorsArray.forEach(dot => dot.classList.remove('active'));
                indicatorsArray[currentIndex].classList.add('active');

                const currentData = slidesData[currentIndex];

                title.textContent = currentData.title;
                subtitle.textContent = currentData.subtitle;
                newsType.textContent = currentData.newsType;
            }, 100)
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slidesData.length) % slidesData.length;
            updateCarousel();
        }
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slidesData.length;
            updateCarousel();
        }

        prev.addEventListener('click', prevSlide);
        next.addEventListener('click', nextSlide);


        initCarousel();
    }

    setErrorMessage(errorType, message) {
        this.name = errorType;
        this.message = message;
        return `${this.name}: ${this.message}`;
    }

    bezier(x0, y0, x1, y1) {
        return t => {
            const cx = 3 * x0;
            const bx = 3 * (x1 - x0) - cx;
            const ax = 1 - cx - bx;

            const cy = 3 * y0;
            const by = 3 * (y1 - y0) - cy;
            const ay = 1 - cy - by;

            const bezierX = t => ((ax * t + bx) * t + cx) * t;
            const bezierY = t => ((ay * t + by) * t + cy) * t;

            let x = t, iterate = 5;
            for (let i = 0; i < iterate; i++) {
                let f = bezierX(x) - t;
                let fPrime = (3 * ax * x + 2 * bx) * x + cx;
                if (fPrime === 0) break;
                x -= f / fPrime;
            }

            return bezierY(x);
        };
    }

    scrollToPosition(element, to, duration = 600, easingFn) {
        const start = element.scrollLeft;
        const change = to - start;
        const startTime = performance.now();

        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easing = easingFn(progress);
            element.scrollLeft = start + change * easing;

            if (elapsed < duration) {
                requestAnimationFrame(animateScroll);
            }
        }

        requestAnimationFrame(animateScroll);
    }


    /**
     * @summary Remove the `index.html` in address bar to act as root directory of website.
     */
    initializeIndexPath() {
        if (window.location.pathname.endsWith('index.html')) {
            const target = window.location.origin + window.location.pathname.replace('index.html', '');
            if (window.location.href !== target) {
                history.replaceState({}, document.title, target)
            }
        }
    }

    /**
     * @summary Determine if label tag has expired time; if expired, the tag will disappear. Dependency of Rave "Cards" elements.
     * @version 1.01 - The label detection only works to Indonesian and English language, fixed incorrect detection.
     */
    setCardTagExpiration(tag) {
        // Note: DO NOT USE "document.querySelector(tag)", as it will only applied to one newest card!
        const labelTags = document.querySelectorAll(tag);
        const now = new Date();
        const DATE_IN_MS = 1000 * 60 * 60 * 24;
        const EXPIRE_DAYS = 7;

        labelTags.forEach(tag => {
            if (!tag.textContent.trim() === 'Baru' || !tag.textContent.trim() === 'New') return;
            const addedAt = new Date(tag.dataset.added)
            const DIFF_DAYS = (now - addedAt) / DATE_IN_MS;
            if (DIFF_DAYS > EXPIRE_DAYS) {
                tag.classList.add('hidden');
            }
        })
    }

    /**
     * @summary Update the clock. This function is now part of Rave Framework.
     * @param {*} clock 
     * @param {*} condition 
     */
    updateClock(clock, condition) {
        let clockEl = document.getElementById(clock);
        let suasana = document.getElementById(condition);
        let date = new Date();
        let hours = String(date.getHours()).padStart(2, '0');
        let min = String(date.getMinutes()).padStart(2, '0');
        clockEl.innerText = `${hours}:${min}`;

        const t = (new Date).getHours();
        suasana.innerHTML = t >= 0 && t < 11 ? "Selamat pagi" : t >= 11 && t < 15 ? "Selamat siang" : t >= 15 && t < 18 ? "Selamat sore" : "Selamat malam"
    }

    animateCounter() {
        function animateCount(obj, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;

                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                obj.innerHTML = Math.floor(progress * (end - start) + start);

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetValue = parseInt(el.getAttribute('data-count-target'), 10);
                    animateCount(el, 0, targetValue, 2000);
                    obs.unobserve(el);
                }
            })
        });

        document.querySelectorAll('[data-count-target]').forEach(el => observer.observe(el));
    }


}

export class Security extends Lyra {
    constructor(version, author) {
        super(version, author)
        this.version = version;
        this.author = author;

        console.log(`Lyra v${this.version} by ${this.author} initialized.`)
    }

    sanitizeHTML(htmlTags) {
        const dom = new DOMParser();
        const doc = dom.parseFromString(htmlTags, "text/html");

        const forbiddenTags = ["script", "embed", "iframe", "link", "meta", "object"];

        const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null, false);
        let node;

        while ((node = walker.nextNode())) {
            const tagName = node.tagName.toLowerCase();

            if (forbiddenTags.includes(tagName)) {
                node.remove();
                continue;
            }

            [...node.attributes].forEach(attr => {
                const name = attr.name.toLowerCase();
                const value = attr.value.toLowerCase();

                if (name.startsWith('on')) {
                    node.removeAttribute(attr.name);
                }

                if (name === "href" || name === "src" && value.startsWith('javascript:')) {
                    node.removeAttribute(attr.name);
                }


            })
        }

        return doc.body.innerHTML;
    }

    /**
     * @version 1.1
     * @summary Format: YYYY-MM-DDTHH:MM:SSZ (UTC time)
     * @param {*} expirationDate 
     */
    setTimebomb(expirationDate) {
        const now = new Date(Date.now());
        expirationDate = new Date(expirationDate);

        if (now > expirationDate.getTime()) {
            window.location.reload();
            window.location.href = "./expired.html";
            throw new Error('This version has expired. Please update to the latest version.');
        } else {
            console.log(`Expiration: ${expirationDate.toUTCString()}`);
        }
    }

    /**
     * @param {*} container Element for image container that need be blurred
     */
    blurContent(container) {
        const containers = document.querySelectorAll(container);

        containers.forEach(el => {
            const warning = document.createElement('div');
            warning.classList.add('content-blurred');

            const warningIcon = document.createElement('i');
            warningIcon.className = 'uil uil-eye-slash';
            warning.appendChild(warningIcon)

            const warningTitle = document.createElement('h1');
            warningTitle.textContent = 'Konten sensitif';
            warning.appendChild(warningTitle)

            const warningDesc = document.createElement('p');
            warningDesc.textContent = 'Konten ini mungkin mengandung konten sensitif yang mungkin dianggap mengganggu oleh sebagian orang.';
            warning.appendChild(warningDesc);
            window.AbortController

            const warningButton = document.createElement('button');
            warningButton.className = 'btn large accent';
            warningButton.textContent = 'Tampilkan';
            warningButton.addEventListener('click', () => {
                warning.style.opacity = 0;
                warning.style.visibility = 'hidden'
                el.style.pointerEvents = 'auto'
            })
            warning.appendChild(warningButton)

        })
    }
}

// Handler
document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', () => {
        const content = detail.querySelector('.accordion-content');
        if (!content) return;

        if (detail.open) {
            content.classList.remove('closing');
            content.classList.add('opening');

            content.style.height = '0px';

            content.style.height = 'auto';

            content.addEventListener('transitionend', function handler() {
                content.classList.remove('opening');
                content.style.height = 'auto';
                content.removeEventListener('transitionend', handler);
            })
        } else {
            content.style.height = content.scrollHeight + 'px';
            content.classList.remove('opening');
            content.classList.add('closing');

            content.style.height = '0px';

            content.addEventListener('transitionend', function handler() {
                content.classList.remove('closing');
                content.style.height = '0px';
                content.removeEventListener('transitionend', handler);
            })

        }
    })
})
