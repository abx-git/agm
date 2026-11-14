#!/usr/bin/env node
/**
 * Build Tekto Studio + static documentation into docs/studio/dist/
 * for GitHub Pages (full site: SPA at /, docs at /docs/).
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { marked } from '../docs/studio/node_modules/marked/lib/marked.esm.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STUDIO = join(ROOT, 'docs/studio');
const DIST = join(STUDIO, 'dist');
const PAGES_CSS = join(ROOT, 'docs/pages/site.css');

const PAGES = [
  { src: 'README.md', out: 'docs/product.html', title: 'Tekto — product' },
  { src: 'docs/quickstart.md', out: 'docs/quickstart.html', title: 'Quickstart' },
  { src: 'docs/positioning.md', out: 'docs/positioning.html', title: 'Positioning' },
  { src: 'docs/guide.md', out: 'docs/guide.html', title: 'Guide' },
  { src: 'docs/ROADMAP.md', out: 'docs/roadmap.html', title: 'Roadmap' },
  { src: 'MIGRATION.md', out: 'docs/migration.html', title: 'Migration from AGM' },
  { src: 'docs/reference/multi-repo.md', out: 'docs/multi-repo.html', title: 'Multi-repo' },
  { src: 'docs/reference/tekto-mcp-install.md', out: 'docs/mcp-install.html', title: 'MCP install' },
  { src: 'docs/reference/tekto-validator.md', out: 'docs/validator.html', title: 'Validator' },
  { src: 'docs/studio/README.md', out: 'docs/studio.html', title: 'Tekto Studio' },
  { src: 'docs/studio/GITHUB-PAGES-SETUP.md', out: 'docs/pages-setup.html', title: 'GitHub Pages setup' },
  { src: 'docs/tekto/steer.md', out: 'docs/example-steer.html', title: 'Example steer.md' },
  { src: 'docs/tekto/index.md', out: 'docs/example-index.html', title: 'Example index' },
];

const OUT_BY_SRC = new Map(PAGES.map((p) => [p.src, p.out]));

function stripFrontmatter(md) {
  if (!md.startsWith('---')) return md;
  const end = md.indexOf('\n---\n', 4);
  if (end === -1) return md;
  return md.slice(end + 5);
}

function rewriteLinks(html) {
  return html.replace(/href="([^"]+\.md)(#[^"]*)?"/g, (all, path, hash = '') => {
    const norm = path.replace(/^\.\//, '').replace(/^\//, '');
    const mapped = OUT_BY_SRC.get(norm);
    if (mapped) {
      const depth = mapped.split('/').length - 1;
      const prefix = depth ? '../'.repeat(depth) : '';
      const base = mapped.replace(/^docs\//, '');
      return `href="${prefix}${base.replace(/\.html$/, '')}.html${hash}"`;
    }
    if (path.startsWith('http') || path.startsWith('#')) return all;
    return all.replace('.md', '.html');
  });
}

function wrapDoc(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} · Tekto</title>
  <link rel="stylesheet" href="./site.css" />
  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
</head>
<body>
  <div class="site-shell">
    <nav class="site-nav">
      <a class="brand" href="../index.html">Tekto Studio</a>
      <a href="index.html">Docs</a>
      <a href="quickstart.html">Quickstart</a>
      <a href="positioning.html">Positioning</a>
      <a href="product.html">Product</a>
      <a href="https://github.com/abx-git/tekto">GitHub</a>
    </nav>
    <main class="doc-main">${bodyHtml}</main>
  </div>
</body>
</html>`;
}

function writeDocsIndex() {
  const cards = [
    ['quickstart.html', 'Quickstart', '10-minute golden path + CI'],
    ['positioning.html', 'Positioning', 'What Tekto is and is not'],
    ['guide.html', 'Guide', 'Skill loops and packets'],
    ['product.html', 'Product README', 'CLI, MCP, daily use'],
    ['studio.html', 'Studio', 'Docs · Review · Composer · Ask AI'],
    ['multi-repo.html', 'Multi-repo', 'interfaces/ across services'],
    ['mcp-install.html', 'MCP', 'Slim agent tools'],
    ['validator.html', 'Validator', 'Optional contract-on-diff'],
    ['roadmap.html', 'Roadmap', 'Release waves'],
    ['example-steer.html', 'Example steer', 'Monorepo docs/tekto/steer.md'],
  ];
  const grid = cards
    .map(
      ([href, h, p]) =>
        `<a class="doc-card" href="${href}"><h2>${h}</h2><p>${p}</p></a>`
    )
    .join('\n');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tekto documentation</title>
  <link rel="stylesheet" href="./site.css" />
  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
</head>
<body>
  <div class="site-shell">
    <nav class="site-nav">
      <a class="brand" href="../index.html">Tekto Studio</a>
      <span>Documentation</span>
    </nav>
    <h1>Tekto on GitHub Pages</h1>
    <p>Static docs from this repository. Use <strong>Tekto Studio</strong> at the site root to bind your own <code>docs/tekto/</code> folder.</p>
    <div class="doc-card-grid">${grid}</div>
  </div>
</body>
</html>`;
  writeFileSync(join(DIST, 'docs/index.html'), html);
}

function build() {
  console.log('Building Tekto Studio (Vite)…');
  const vite = spawnSync('npm', ['run', 'build'], {
    cwd: STUDIO,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (vite.status !== 0) process.exit(vite.status ?? 1);

  const docsDir = join(DIST, 'docs');
  mkdirSync(docsDir, { recursive: true });
  cpSync(PAGES_CSS, join(docsDir, 'site.css'));

  marked.setOptions({ gfm: true, mangle: false, headerIds: false });

  for (const page of PAGES) {
    const srcPath = join(ROOT, page.src);
    if (!existsSync(srcPath)) {
      console.warn(`skip missing: ${page.src}`);
      continue;
    }
    const md = stripFrontmatter(readFileSync(srcPath, 'utf8'));
    let body = marked.parse(md);
    body = rewriteLinks(body);
    const html = wrapDoc(page.title, body);
    const outPath = join(DIST, page.out);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    console.log('doc', relative(ROOT, outPath));
  }

  writeDocsIndex();

  // Copy monorepo docs/tekto tree for static fetch (steer model demo)
  const tektoSrc = join(ROOT, 'docs/tekto');
  const tektoDest = join(DIST, 'docs/tekto-bundle');
  if (existsSync(tektoSrc)) {
    rmSync(tektoDest, { recursive: true, force: true });
    cpSync(tektoSrc, tektoDest, { recursive: true });
    console.log('bundle docs/tekto → docs/tekto-bundle/');
  }

  touchNojekyll(DIST);
  console.log('Pages site ready:', DIST);
}

function touchNojekyll(dir) {
  writeFileSync(join(dir, '.nojekyll'), '');
}

build();