import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

const ROOT = 'articles';
const manifest = {};

function walkDir(dir) {
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) {
            walkDir(full);
        } else if (name.endsWith('.md')) {
            const slug = name.replace(/\.md$/, '');
            manifest[slug] = '/' + relative('.', full).replace(/\\/g, '/');
        }
    }
}

walkDir(ROOT);
writeFileSync('json/articles-manifest.json', JSON.stringify(manifest, null, 2));
console.log(`Built manifest with ${Object.keys(manifest).length} articles.`);