document.addEventListener('click', (e) => {
    const link = e.target.closest('a.md-link');
    if (!link) return;
    e.preventDefault();

    const slug = link.getAttribute('href').split('/').pop().replace(/\.md$/, '');
    
    fetch(`/json/rticles-manifest.json`)
        .then(res => res.json())
        .then(manifest => {
            const path = manifest[slug];
            if (!path) throw new Error('not found');
            return fetch(path);
        })
        .then(res => {
            if (!res.ok) throw new Error('not found');
            return res.text();
        })
        .then(data => {
            const raw = marked.parse(data);
            const safe = DOMPurify.sanitize(raw);
            document.getElementById('article-root').innerHTML = safe;
            history.pushState({}, '', `/articles/${slug}`);
        }).catch(() => {
            document.getElementById('article-root').textContent = 'Article not found.';
        })
})