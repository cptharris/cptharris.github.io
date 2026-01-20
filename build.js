const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const beautify = require('js-beautify').html;

const srcDir = path.join(__dirname, 'source');
const outDir = path.join(__dirname, 'public');

// Configure nunjucks environment
nunjucks.configure(srcDir, {
    autoescape: true,
    noCache: true,
    trimBlocks: true,
    lstripBlocks: true
});

function buildFile(file) {
    if (!file.endsWith('.njk')) return;
    if (path.basename(file).startsWith('_')) return;

    const relativePath = path.relative(srcDir, file);
    const outFile = path.join(outDir, relativePath.replace(/\.njk$/, '.html'));

    console.log(`🛠  Rendering ${relativePath} → ${path.relative(outDir, outFile)}`);

    const html = nunjucks.render(relativePath, {
        siteName: "Captain Harris" // global variable
    });
    const formattedHtml = beautify(html, {
        indent_with_tabs: true,
        indent_size: 1,
        preserve_newlines: true,
        max_preserve_newlines: 1
    });

    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, formattedHtml, 'utf8');
}

// Initial build of all njk files
function buildAll(dir = srcDir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
            buildAll(fullPath);
        } else {
            if (fullPath.endsWith('.njk')) buildFile(fullPath);
        }
    });
}

// Watch for changes
chokidar.watch(srcDir).on('change', buildFile).on('add', buildFile);

buildAll();
console.log('👀 Watching source .njk files for changes...');