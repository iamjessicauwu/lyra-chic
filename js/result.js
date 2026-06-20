
const input = document.getElementById('search-input');
const suggested = document.querySelector('.suggested-search');
input.addEventListener('input', (e) => {
    if (e.target.value === '' || e.target.value === null) { suggested.classList.remove('hidden') } else { suggested.classList.add('hidden') }
});