console.log('Diana script loaded!');

const diana = document.querySelector('.project-diana');

function saveToggleState(...pairs) {
    pairs.forEach(([cbx, preferredClassName, state]) => {
        const checkEl = diana.querySelector(cbx);
        if (!checkEl) return;

        const savedState = localStorage.getItem(state) === 'true' /* for checkbox state, don't remove `=== 'true'` because it will always return false. */;
    
        document.body.classList.toggle(preferredClassName, savedState);
        checkEl.checked = savedState; /* will return true or false */
    
        checkEl.addEventListener('change', () => {
            const enabled = checkEl.checked;
    
            document.body.classList.toggle(preferredClassName, enabled);
            localStorage.setItem(state, enabled);
        })
    })
}

saveToggleState(
    ['#zodiacCbx', 'zodiac', 'zodiac'],
    ['#editableSections', 'editable-sections', 'editableSection'],
    ['#boundsCbx', 'bounds', 'bounds']

)

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

const hideMember = diana.querySelector('#hideMember');
const hideState = localStorage.getItem('hide') === 'true';

document.querySelectorAll('.people.special').forEach(el => el.classList.toggle('hidden', hideState));
hideMember.checked = hideState;

hideMember.addEventListener('change', () => {
    const enabled = hideMember.checked;

    document.querySelectorAll('.people.special').forEach(el => el.classList.toggle('hidden', enabled));
    localStorage.setItem('hide', enabled);
});
let link = document.querySelector('link.people-card-style');
if (!link) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.classList.add('people-card-style');
    style.href = "/Lyra_UI/css/people.css";
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