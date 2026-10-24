import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
const html=await readFile('dist/ardor/index.html','utf8');
assert.match(html,/<html lang="zh-CN">/);
assert.match(html,/<title>Ardor/);
assert.match(html,/AI CAREER WORKSPACE/);
assert.equal((html.match(/role="tab"/g)||[]).length,5);
assert.ok(!html.includes('portfolio-'),'Ardor must not import the portfolio application');
const js=await readFile('dist/ardor/showcase.js','utf8');
assert.ok(!/\b(fetch|XMLHttpRequest|WebSocket)\s*\(/.test(js),'Static tour must never call a backend');
for(const name of ['conversation','resume','resume-detail','interview','interview-detail','learning','learning-detail','trace','trace-detail']){
 const file=await readFile(`dist/ardor/screenshots/${name}.png`);
 assert.equal(file.subarray(1,4).toString(),'PNG');
 assert.ok(file.readUInt32BE(16)>=1400 && file.readUInt32BE(20)>=900,`${name} must be a readable product capture`);
 assert.ok((await stat(`dist/ardor/screenshots/${name}.png`)).size<2500000,`${name} exceeds the static asset budget`);
}
console.log('Ardor: independent entry, five features, nine PNGs, no backend dependency verified.');
