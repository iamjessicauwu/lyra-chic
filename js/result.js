document.addEventListener('DOMContentLoaded', () => {
    const prevtext = document.querySelector('.prev-search-text');
    const urlParams = new URLSearchParams(window.location.search);
    const searchText = urlParams.get('search').toLowerCase();

    if (searchText) {
        prevtext.textContent = searchText;
        document.title = `Hasil pencarian untuk "${searchText}" - Lyra Aura` 
    } else {
        prevtext.textContent = "null";
    }

    fetch('/json/search.json')
        .then(response => response.json())
        .then(data => {
            const searchResult = data.filter(item => item.title.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText));
            const flex = document.querySelector('.grid');
            const resultCount = searchResult.length;

            if (resultCount > 0) {
                searchResult.forEach(item => {
                    const articleElement = document.createElement('div');
                    articleElement.classList.add('people', 'no-banner');

                    const top_text = document.createElement('div');
                    top_text.classList.add('people-bio');

                    const title = document.createElement('h2');
                    title.classList.add('name');
                    title.innerHTML = `${item.title}`;
                    

                    const img = document.createElement('div');
                    img.classList.add('people-img');

                    const imgvalue = document.createElement('img');
                    imgvalue.src = `${item.image}`;
                    imgvalue.style.objectFit = 'cover';

                    function trimText(text, maxChars) {
                        if (text.length <= maxChars) {
                            return text;
                        }
                        return text.substring(0, maxChars) + "...";
                    }

                    const desc = document.createElement('p');
                    desc.textContent = trimText(`${item.description}`, 60);
                    top_text.appendChild(img);
                    img.appendChild(imgvalue);
                    top_text.appendChild(title);
                    top_text.appendChild(desc);

                    articleElement.appendChild(top_text);

                    articleElement.style.opacity = "1";
                    articleElement.style.visibility = "visible";
                    flex.appendChild(articleElement);

                    articleElement.addEventListener('click', () => {
                        window.location.href = `${item.url}`
                    })
                });
            } else {
                flex.innerHTML = `<p>Tidak ada hasil ditemukan untuk "${searchText}"</p>`;
            }
        })
        .catch(error => console.error('Error fetching search results:', error));
})