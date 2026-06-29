import Lyra from "./Lyra_UI/js/main.js";
const lyra = Lyra ? new Lyra("1.0", "Jessica Noleen Alka") : null;

const labelTags = document.querySelectorAll(".people .labelTag"),
now = new Date(),
DATE_IN_MS = 864e5,
EXPIRE_DAYS = 7;

labelTags.forEach((e) => {
    if ("Baru" === !e.textContent.trim() || "New" === !e.textContent.trim())
        return;
        const t = new Date(e.dataset.added);
        (now - t) / DATE_IN_MS > EXPIRE_DAYS && e.classList.add("hidden");
});

const timeline = ".list",
timelineItems = ".list-item",
features = ".features",
featuresItem = ".features .flex-box",
sections = ".section",
sectionTitleCtr = '.gallery-container .img',
sectionTitle = '.section-header.stylish .section-title',
main = "#scroll";
lyra.intersectElements(timeline, timelineItems, "translateY", 10);
lyra.intersectElements(features, featuresItem, "translateY", 50);
lyra.intersectElements(sectionTitle, sectionTitleCtr, "translateY", 50);
// lyra.intersectElements(main, sections, "translateY", 100);
lyra.animateOnScroll('.gallery-container', {
    target: '.gallery-container img',
    stagger: 0.09
})
lyra.animateOnScroll('.grid.rtl', {
    target: '.gallery-container img',
    stagger: 0.09
})
lyra.animateOnScroll('.people', {
    stagger: 0.09
})
lyra.animateCounter();
