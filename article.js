import Lyra from "./Lyra_UI/js/main.js";

const lyra = Lyra ? new Lyra("1.05", "Lyra Chic") : null;

lyra.setCarousel({
    json: './json/news-carousel.json',
    title: document.querySelector('.carousel-title'),
    subtitle: document.querySelector('.carousel-subtitle'),
    track: document.querySelector('.carousel-track'),
    newsType: document.querySelector('.carousel-news-type'),
    indicators: document.querySelector('.carousel-indicators'),
    prev: document.querySelector('.prev-btn'),
    next: document.querySelector('.next-btn'),
    duration: 5000
});
