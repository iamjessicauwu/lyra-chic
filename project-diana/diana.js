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