import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';

const html=await readFile('dist/ardor/index.html','utf8');
assert.match(html,/<html lang="zh-CN">/);
assert.match(html,/<title>Ardor/);
assert.match(html,/AI CAREER WORKSPACE/);
assert.equal((html.match(/class="chapter"/g)||[]).length,4,'The tour must keep four chapters');
for(const heading of ['求职记录','面试复盘','定向学习','Agent 执行'])assert.ok(html.includes(heading),`Missing chapter: ${heading}`);
assert.equal((html.match(/class="shot-open"/g)||[]).length,6,'The tour must show six product captures');
assert.ok(!html.includes('role="tab"'),'The old tabbed feature list must stay removed');
assert.ok(!html.includes('portfolio-'),'Ardor must not import the portfolio application');

const favicon=await readFile('dist/ardor/favicon.svg','utf8');
assert.ok(favicon.includes('M286 286'),'The official four-petal Ardor mark must be the favicon');
assert.ok(!favicon.includes('M13 3c1 5'),'The legacy flame mark must not return');

const js=await readFile('dist/ardor/showcase.js','utf8');
assert.ok(!/\b(fetch|XMLHttpRequest|WebSocket)\s*\(/.test(js),'Static tour must never call a backend');

for(const name of ['conversation','resume','latex','interview','learning','trace']){
  const path=`dist/ardor/screenshots/${name}.png`;
  const file=await readFile(path);
  assert.equal(file.subarray(1,4).toString(),'PNG',`${name} must be a PNG`);
  assert.ok(file.readUInt32BE(16)>=2800 && file.readUInt32BE(20)>=1800,`${name} must be a high-resolution capture`);
  assert.ok((await stat(path)).size<2500000,`${name} exceeds the static asset budget`);
}
console.log('Ardor: independent entry, four-chapter tour, six high-resolution captures, official mark, no backend dependency verified.');
