"use strict"
let data = [];

async function fetchPeople(url) {
    try {
        const response = await fetch(url);
        data = await response.json();

        renderCard('.people-bio');
    } catch (err) {
        console.error("Error fetching people bio", err);
    }
}

function renderCard(peopleBioEl) {
    const map = new Map();

    document.querySelectorAll(peopleBioEl).forEach(el => {
        const key = el.dataset.people;
        if (!map.has(key)) {
            map.set(key, []);
        }

        map.get(key).push(el);
    });
    data.forEach(person => {
        const elements = map.get(String(person.id));
        if (!elements) return;

        elements.forEach(el => {
            const container = el.closest(".people");
            const name = el.querySelectorAll(".name h2");
            const nicks = el.querySelectorAll(".name .role");
            const zodiacImgs = el.querySelectorAll("img.person-zodiac");
            const role = person.role;
            const roles = container.querySelectorAll(".person-role");
            
            roles.forEach(el => el.textContent = role);

            name.forEach(n => { n.textContent = person.name; n.setAttribute('spellcheck', 'false')} );

            nicks.forEach(nick => {
                let text = person.nickname.replace(/&bull;/g, "•");
                const isZodiac = document.body.classList.contains('zodiac');
                                
                zodiacImgs.forEach(zodiacImg => {
                    if (isZodiac) {
                        zodiacImg.style.display = 'block';
                        text = `${person.nickname.replace(/&bull;/g, "•")} | ${person.zodiac} • ${role}`;
                    } else {
                        zodiacImg.style.display = 'none';
                        text = `${person.nickname.replace(/&bull;/g, "•")} • ${role}`;
                    }
                });
                
                const old = document.querySelector('.people-card-style');
                if (old) {
                    text = `${person.nickname.replace(/&bull;/g, "•")}`;
                }

                nick.textContent = text;
            });


            const profileImg = container.querySelector(".people-img img");
            const link = container.querySelector(".people-btns a");

            if (profileImg) {
                profileImg.alt = `${person.name}'s profile picture.`;
            }

            if (link) {
                link.ariaLabel = `Learn more about ${person.role}`;
            }
        });
    });
}

fetchPeople("./json/peopleBio.json");

const peopleImg = document.querySelectorAll(".people-img img");
peopleImg.forEach((e) => {
    e.setAttribute("fetchpriority", "high");
});

const people = document.querySelectorAll('.people');
const panel = document.querySelector('.people-panel');
const nameEl = panel.querySelector('.name h2');
const roleEl = panel.querySelector('.nickname');
const desc = panel.querySelector('p');
const badges = panel.querySelector('.badge-row');
const portfolioCtr = panel.querySelector('.member-portfolio');
const peopleCtr = document.querySelector('.grid');
let activeCard = null;

people.forEach(card => {
    card.setAttribute('data-dialog-open', 'people-panel');
    const key = card.querySelector('.people-bio').dataset.people;

    function showPeoplePanel() {
        const bio = card.querySelector('.people-bio');
        const key = bio.dataset.people;
        const person = data.find(p => String(p.id) === key);
    
        activeCard = card;
        activeCard.classList.add('focus');

        nameEl.textContent = person.name;

        let nick = person.nickname.replace(/&bull;/g, "/");
        if (person.role?.trim()) {
            nick = `${nick} | ${person.role}`;
        }
        
        roleEl.textContent = nick;
        
        desc.textContent = "";

        if (!person.description?.trim()) {
            desc.textContent = "Tidak ada biografi";
            desc.classList.add("empty");
            return;
        }

        // Replace the HTML line break tag with actual line break, then create a document fragment.
        const lines = person.description.replace(/&bull;/g, "•").replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*(.*?)\*/g, '<i>$1</i>').split('<br>');
        const fragment = document.createDocumentFragment();

        lines.forEach((line, i) => {
            const p = document.createElement('p');
            p.innerHTML = line.trim();
            fragment.appendChild(p);

            if (i < lines.length - 1) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        desc.appendChild(fragment);

        const profileImg = panel.querySelector(".people-img img");
        const bannerImg = panel.querySelector(".people-banner img");
        const link = panel.querySelector(".people-btns a");

        profileImg.alt = `${person.name}'s profile picture.`;
        profileImg.src = person.image;

        if (person.banner_image !== ""  || person.banner_image ||bannerImg) {
            const image = person.banner_image;
            bannerImg.alt = `${person.name}'s banner image.`;
            bannerImg.src = image;
        }

        if (link) {
            link.ariaLabel = `Learn more about ${person.role}`;
        }
        
        const cardLink = card.querySelector(".people-btns .social-media");
        const panelBtns = panel.querySelector(".people-btns");

        if (cardLink && panelBtns) {
            panelBtns.innerHTML = "";
            panelBtns.appendChild(cardLink.cloneNode(true));
        }
        
        if (cardLink.children.length < 1) {
            const p = document.createElement("p");
            p.textContent = "No social media are available for this member.";
            panelBtns.appendChild(p);
        }

        const badgesArray = person.badges;
        badges.textContent = '';
        
        if (badgesArray && badgesArray.length > 0) {
            badgesArray.map(badge => {
                badges.style.display = 'flex';
                const category = document.createElement('span');
                category.className = 'badge badge-roast';
                if (badge === 'ST☆RGΛINZ Member') {
                    category.className = 'badge badge-outline';
                }
                category.textContent = badge;
                
                badges.appendChild(category);
            }) 
        } else {
            badges.textContent = ``;
            badges.style.display = 'none';
        }

        const portfolios = person.portfolio;
        portfolios.innerHTML = '';
        
        if (portfolios && portfolios.length > 0) {
            portfolios.map(el => {
                if (el.includes('.jpg') || el.includes('.png') || el.includes('.webp')) {
                    const imgs = document.createElement('img');
                    imgs.src = el;
                    portfolioCtr.appendChild(imgs);
                }
                if (el.includes('.mp4')) {
                    const video = document.createElement('video');
                    video.controls = 'true';
                    const source = document.createElement('source');
                    source.src = el;
                    video.appendChild(source);
                    portfolioCtr.appendChild(video);
                }

            })
        } else {
            portfolios.innerHTML = '';
            portfolios.style.display = 'none';
        }
    }
    
    card.addEventListener('click', showPeoplePanel);
})

function closePanel() {
    if (activeCard) {
        activeCard.classList.remove('focus');
    }
    panel.addEventListener('animationend', () => {
        panel.scrollTop = 0;
        portfolioCtr.innerHTML = ''
    }, {once: true});
}

document.querySelector('#close-panel').addEventListener('click', closePanel);

