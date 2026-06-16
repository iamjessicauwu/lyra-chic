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

const stylesheets = ["people_3.css", "people_list.css", "people_lyraaura.css"];
const relativeUrl = '/Lyra_UI/css/';
const selected = new Set();

function init() {
    const savedIndex = localStorage.getItem('sheetIndex');
    const savedSelected = JSON.parse(localStorage.getItem('selectedGroups') || '[]');

    if (savedIndex !== null) {
        const link = document.querySelector('link[rel="stylesheet"]');
        if (link) link.href = stylesheets[parseInt(savedIndex)];
    }

    savedSelected.forEach(name => selected.add(name));
}

function swapCSS() {
    let sheetIndex = parseInt(localStorage.getItem('sheetIndex') || '0');
    sheetIndex = (sheetIndex + 1) % stylesheets.length;

    const link = document.querySelector('.people-card-style');
    const relativePath = '/Lyra_UI/css/';
    
    if (link) {
        link.href = relativePath + stylesheets[sheetIndex];
    } else {
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = stylesheets[sheetIndex];
        document.head.appendChild(newLink);
    }

    localStorage.setItem('sheetIndex', sheetIndex);
}

document.querySelectorAll('.radio-card-style').forEach(radio => {
    radio.addEventListener('change', (e) => {
        selected.add(e.target.name);
        
        localStorage.setItem('selectedGroups', JSON.stringify([...selected]));
        
        if (selected.size >= 3) {
            swapCSS();
            selected.clear();
            localStorage.removeItem('selectedGroups');
        }
    });
});