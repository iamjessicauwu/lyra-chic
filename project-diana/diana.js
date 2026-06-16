console.log("Diana script loaded.");

const zodiacCbx = document.getElementById('zodiacCbx');
const zodiacState = localStorage.getItem('zodiac');

document.body.classList.toggle('zodiac', zodiacState);
zodiacCbx.checked = zodiacState;

zodiacCbx.addEventListener('change', () => {
    const enabled = zodiacCbx.checked;

    document.body.classList.toggle('zodiac', enabled);
    localStorage.setItem('zodiac', enabled);
})

const editableSectionsCbx = document.getElementById('editableSections');
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
            clearTimeout(title._outlineTimeout);
            title._outlineTimeout = setTimeout(() => {
                title.style.outline = '';
            }, 1000);
        });
    })
}

const link = document.querySelector('link.people-card-style');
const stylesheets = ['people_3.css', 'people_list.css', 'people_lyraaura.css'];
const BASE_PATH = link.href.substring(0, link.href.lastIndexOf('/') + 1);
const selected = new Set();
console.log('BASE_PATH:', BASE_PATH);
console.log('full href will be:', BASE_PATH + stylesheets[0]);
console.log('link element:', link); // null = selector wrong

function init() {
    const savedIndex = localStorage.getItem('sheetIndex');
    const savedSelected = JSON.parse(localStorage.getItem('selectedGroups') || '[]');

    if (savedIndex !== null) {
        const link = document.querySelector('link.people-card-style');
        if (link) link.href = BASE_PATH + stylesheets[parseInt(savedIndex)];
    }

    savedSelected.forEach(name => selected.add(name));
}

function swapCSS() {
    let sheetIndex = parseInt(localStorage.getItem('sheetIndex') ?? '-1');
    sheetIndex = (sheetIndex + 1) % stylesheets.length;
    
    if (!link) {
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.classList.add('people-card-style')
        newLink.href = BASE_PATH + stylesheets[sheetIndex];
        document.head.appendChild(newLink);
    }
    
    link.href = BASE_PATH + stylesheets[sheetIndex];

    localStorage.setItem('sheetIndex', sheetIndex);
}

document.querySelectorAll('.radio-card-style').forEach(radio => {
    radio.addEventListener('change', (e) => {
        selected.add(e.target.value);
        
        localStorage.setItem('selectedGroups', JSON.stringify([...selected]));
        
        if (selected.size >= 3) {
            console.log('worked!');
            swapCSS();
            selected.clear();
            localStorage.removeItem('selectedGroups');
        }
    });
});

init();