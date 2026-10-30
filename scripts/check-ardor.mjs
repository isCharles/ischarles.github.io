import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';

const html=await readFile('dist/ardor/index.html','utf8');
assert.match(html,/<html lang="zh-CN">/);
assert.match(html,/<title>Ardor/);
assert.ok(html.includes('AI for a more capable you'),'The official slogan must replace the old workspace label');
assert.ok(!html.includes('AI CAREER WORKSPACE'),'The old workspace label must stay removed');
assert.ok(html.includes('id="lang-toggle"'),'The page must expose a language switch');
assert.ok(html.includes('Turn your job search'),'The English hero must be present');
assert.equal((html.match(/class="chapter"/g)||[]).length,4,'The tour must keep four chapters');
for(const heading of ['求职记录','面试复盘','定向学习','Agent 执行'])assert.ok(html.includes(heading),`Missing chapter: ${heading}`);
for(const heading of ['Job search record','Interview review','Targeted learning','Agent execution'])assert.ok(html.includes(heading),`Missing English chapter: ${heading}`);
assert.equal((html.match(/class="shot-open"/g)||[]).length,6,'The tour must show six product captures');
assert.equal((html.match(/data-en-title=/g)||[]).length,6,'Every capture needs an English dialog title');
assert.ok(!html.includes('role="tab"'),'The old tabbed feature list must stay removed');
assert.ok(!html.includes('portfolio-'),'Ardor must not import the portfolio application');
assert.ok(!html.includes('/ardor/favicon.svg'),'The cached legacy favicon path must not be referenced');

const mark=await readFile('dist/ardor/ardor-mark.svg','utf8');
assert.ok(mark.includes('M286 286'),'The official four-petal Ardor mark must be the favicon');
assert.ok(!mark.includes('M13 3c1 5'),'The legacy flame mark must not return');
assert.ok(html.includes('/ardor/ardor-mark.svg'),'The page must use the cache-busted official mark');
assert.ok(html.includes('/ardor/ardor-mark-32.png'),'A PNG favicon fallback must be declared');
assert.ok(html.includes('/ardor/ardor-mark-180.png'),'An apple-touch icon must be declared');
for(const name of ['ardor-mark.svg','ardor-mark-32.png','ardor-mark-180.png']){
  await stat(`dist/ardor/${name}`);
}

const js=await readFile('dist/ardor/showcase.js','utf8');
assert.ok(!/\b(fetch|XMLHttpRequest|WebSocket)\s*\(/.test(js),'Static tour must never call a backend');
assert.ok(js.includes('applyLanguage')&&js.includes('ardor-lang'),'The language switch must be implemented locally');
assert.ok(js.includes('Switch to Chinese')&&js.includes('切换为英文'),'Both language switch labels must exist');

for(const name of ['conversation','resume','latex','interview','learning','trace']){
  const path=`dist/ardor/screenshots/${name}.png`;
  const file=await readFile(path);
  assert.equal(file.subarray(1,4).toString(),'PNG',`${name} must be a PNG`);
  assert.ok(file.readUInt32BE(16)>=2800 && file.readUInt32BE(20)>=1800,`${name} must be a high-resolution capture`);
  assert.ok((await stat(path)).size<2500000,`${name} exceeds the static asset budget`);
}
console.log('Ardor: bilingual entry, official slogan, cache-busted mark, four-chapter tour, six high-resolution captures, no backend dependency verified.');
