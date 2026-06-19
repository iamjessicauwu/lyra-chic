console.log('Diana script loaded!');

const diana = document.querySelector('.project-diana');

const zodiacCbx = diana.querySelector('#zodiacCbx');
const zodiacState = localStorage.getItem('zodiac') === 'true';

document.body.classList.toggle('zodiac', zodiacState);
zodiacCbx.checked = zodiacState;

zodiacCbx.addEventListener('change', () => {
    const enabled = zodiacCbx.checked;

    document.body.classList.toggle('zodiac', enabled);
    localStorage.setItem('zodiac', enabled);
})

const editableSectionsCbx = diana.querySelector('#editableSections');
const editableSectionsState = localStorage.getItem('editableSections') === 'true';

document.body.classList.toggle('editable-sections', editableSectionsState);
editableSectionsCbx.checked = editableSectionsState;

editableSectionsCbx.addEventListener('change', () => {
    const enabled = editableSectionsCbx.checked;

    document.body.classList.toggle('editable-sections', enabled);
    localStorage.setItem('editableSections', enabled);
})

const sectionTitles = document.querySelectorAll('.section-title, .people .name h2, .side-panel .name h2');
    
if (document.body.classList.contains('editable-sections')) {
    sectionTitles.forEach(title => {
        title.contentEditable = true;
        title.setAttribute('aria-label', 'Editable section title. Click to edit.');
        title.addEventListener('input', () => {
            title.style.outline = '2px solid var(--color-primary-500)';
            title.setAttribute('spellcheck', 'false');
            clearTimeout(title._outlineTimeout);
            title._outlineTimeout = setTimeout(() => {
                title.style.outline = '';
            }, 1000);
        });
    })
}

const bounds = diana.querySelector('#boundsCbx');
const boundsState = localStorage.getItem('bounds') === 'true';

document.body.classList.toggle('bounds', boundsState);
bounds.checked = boundsState;

bounds.addEventListener('change', () => {
    const enabled = bounds.checked;

    document.body.classList.toggle('bounds', enabled);
    localStorage.setItem('bounds', enabled);
});
let link = document.querySelector('link.people-card-style');
if (!link) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.classList.add('people-card-style');
    style.href = "/Lyra_UI/css/people_3.css";
    document.head.appendChild(style);
    link = style;
}
const appliedStyle = localStorage.getItem('selectedStyle');
const BASE_PATH = '/Lyra_UI/css/';

if (appliedStyle) {
    link.href = BASE_PATH + appliedStyle;
}

diana.querySelectorAll('.radio-card-style').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const value = e.target.value;
        
        link.href = BASE_PATH + value;
        localStorage.setItem('selectedStyle', value);
    });
    
    if (radio.value === appliedStyle) {
        radio.checked = true;
    }
});