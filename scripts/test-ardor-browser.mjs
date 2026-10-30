import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {mkdir} from 'node:fs/promises';
await mkdir('node_modules/.cache/ardor-showcase',{recursive:true});
if(!process.env.ARDOR_FRONTEND_DIR)throw new Error('Set ARDOR_FRONTEND_DIR to use its existing Playwright dependency.');
const {chromium}=createRequire(resolve(process.env.ARDOR_FRONTEND_DIR,'package.json'))('playwright');
const base=process.env.SHOWCASE_BASE??'http://127.0.0.1:4175';
const browser=await chromium.launch({headless:true,...(process.env.ARDOR_CAPTURE_BROWSER?{channel:process.env.ARDOR_CAPTURE_BROWSER}:{})});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1080},locale:'zh-CN'}),errors=[],badRequests=[],apiRequests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)badRequests.push(r.status()+' '+r.url());});
 page.on('request',r=>{if(r.url().includes('/api/'))apiRequests.push(r.url());});
 await page.goto(base+'/ardor/');
 await page.getByRole('heading',{level:1}).waitFor();
 assert.match(await page.title(),/^Ardor/);
 assert.equal(await page.locator('.brand-note').textContent(),'AI for a more capable you');
 const logo=page.locator('.brand img');
 await page.waitForFunction(()=>{const image=document.querySelector('.brand img');return image&&image.complete&&image.naturalWidth>0;});
 assert.ok((await logo.getAttribute('src')).includes('/ardor/ardor-mark.svg'));
 const icons=await page.locator('link[rel="icon"]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
 assert.ok(icons.includes('/ardor/ardor-mark.svg'),'The SVG mark must be declared with its new URL');
 assert.ok(icons.includes('/ardor/ardor-mark-32.png'),'The PNG favicon fallback must be declared');
 assert.equal(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href'),'/ardor/ardor-mark-180.png');
 assert.equal(await page.locator('a[href="https://github.com/isCharles/project-ardor"]').count(),1,'GitHub must have exactly one entrance');
 assert.equal(await page.locator('.nav-product, .down, .meta, .hero-foot').count(),0,'Duplicate entrances and the extra meta line must stay removed');

 const headings={zh:['求职记录','面试复盘','定向学习','Agent 执行'],en:['Job search record','Interview review','Targeted learning','Agent execution']};
 const labels={
   zh:{hero:'把求职过程',toggle:'EN',toggleLabel:'切换为英文',zoom:'原始尺寸',fit:'适应窗口',close:'关闭'},
   en:{hero:'Turn your job search',toggle:'中文',toggleLabel:'Switch to Chinese',zoom:'Original size',fit:'Fit to window',close:'Close'}
 };

 async function expectLanguage(language){
   const expected=labels[language];
   assert.equal(await page.locator('html').getAttribute('lang'),language==='en'?'en':'zh-CN');
   assert.equal((await page.locator('.lang-toggle').textContent()).trim(),expected.toggle);
   assert.equal(await page.locator('.lang-toggle').getAttribute('aria-label'),expected.toggleLabel);
   assert.ok((await page.locator('h1').innerText()).includes(expected.hero));
   assert.deepEqual((await page.locator('h2').allInnerTexts()).map(value=>value.trim()),headings[language]);
   assert.equal(await page.getByRole('heading',{level:2}).count(),4,'The tour must show four chapters');
 }

 async function openAllCaptures(language){
   const expected=labels[language];
   const shots=page.locator('.shot-open');
   assert.equal(await shots.count(),6,'The tour must show six product captures');
   for(let index=0;index<await shots.count();index++){
     const button=shots.nth(index);
     const dialogTitle=await button.getAttribute(`data-${language}-title`);
     const dialogLabel=await button.getAttribute(`data-${language}-label`);
     assert.equal(await button.getAttribute('aria-label'),dialogLabel);
     const thumbnail=button.locator('img');
     await thumbnail.scrollIntoViewIfNeeded();
     assert.equal(await thumbnail.getAttribute('alt'),await thumbnail.getAttribute(`data-${language}-alt`));
     await button.click();
     const dialog=page.locator('#shot-dialog[open]');
     await dialog.waitFor();
     assert.equal((await page.locator('#shot-title').textContent()).trim(),dialogTitle);
     await page.waitForFunction(()=>{const image=document.querySelector('#shot-image');return image&&image.complete&&image.naturalWidth>0;});
     assert.equal((await page.locator('#shot-zoom').textContent()).trim(),expected.zoom);
     assert.equal((await page.locator('#shot-close').textContent()).trim(),expected.close);
     await page.locator('#shot-zoom').click();
     assert.ok(await dialog.evaluate(element=>element.classList.contains('is-zoomed')),'The original-size toggle must zoom the capture');
     assert.equal((await page.locator('#shot-zoom').textContent()).trim(),expected.fit);
     await page.locator('#shot-zoom').click();
     await page.keyboard.press('Escape');
     assert.equal(await page.locator('#shot-dialog[open]').count(),0,'Escape must close the capture');
   }
 }

 async function captureLanguage(language){
   for(const width of [1440,900,390]){
     await page.setViewportSize({width,height:1080});
     await page.evaluate(()=>window.scrollTo(0,0));
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`No overflow in ${language} at ${width}`);
     await page.screenshot({path:`node_modules/.cache/ardor-showcase/showcase-${language}-${width}.png`,fullPage:true,animations:'disabled'});
   }
 }

 await expectLanguage('zh');
 assert.match(await page.title(),/AI 求职工作台/);
 assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).startsWith('Ardor 是一个'));
 await openAllCaptures('zh');
 await captureLanguage('zh');

 await page.setViewportSize({width:1440,height:1080});
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.locator('#lang-toggle').click();
 await page.waitForFunction(()=>document.documentElement.lang==='en');
 await expectLanguage('en');
 assert.match(await page.title(),/AI career workspace/);
 assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).startsWith('Ardor is'));
 assert.equal(await page.evaluate(()=>localStorage.getItem('ardor-lang')),'en');
 await openAllCaptures('en');
 await captureLanguage('en');

 await page.reload();
 await page.getByRole('heading',{level:1}).waitFor();
 await expectLanguage('en');
 assert.equal(await page.evaluate(()=>localStorage.getItem('ardor-lang')),'en','The language choice must survive a reload');

 await page.setViewportSize({width:390,height:844});
 const mobileShot=page.locator('.shot-open').first();
 await mobileShot.scrollIntoViewIfNeeded();
 await mobileShot.click();
 await page.locator('#shot-dialog[open]').waitFor();
 await page.waitForFunction(()=>{const image=document.querySelector('#shot-image');return image&&image.complete&&image.naturalWidth>0;});
 const bounds=await page.locator('#shot-dialog[open]').boundingBox();
 assert.ok(bounds&&bounds.width<=390&&bounds.x>=0,'The capture preview must fit a phone viewport');
 await page.keyboard.press('Escape');

 await page.setViewportSize({width:1440,height:1080});
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.locator('#lang-toggle').click();
 await page.waitForFunction(()=>document.documentElement.lang==='zh-CN');
 await expectLanguage('zh');
 assert.equal(await page.evaluate(()=>localStorage.getItem('ardor-lang')),'zh');

 const englishDefault=await browser.newPage({viewport:{width:1440,height:900},locale:'en-US'});
 await englishDefault.goto(base+'/ardor/');
 await englishDefault.getByRole('heading',{level:1}).waitFor();
 assert.equal(await englishDefault.locator('html').getAttribute('lang'),'en','A non-Chinese browser should start in English');
 await englishDefault.close();

 await page.goto(base+'/');
 await page.getByRole('button',{name:'Open Ardor project details',exact:true}).click();
 assert.equal(await page.getByRole('link',{name:'PRODUCT TOUR',exact:true}).getAttribute('href'),'/ardor/');
 assert.deepEqual(errors,[]);assert.deepEqual(badRequests,[]);assert.deepEqual(apiRequests,[]);
 console.log(JSON.stringify({languages:['zh','en'],chapters:4,captures:6,viewports:[1440,900,390],errors,badRequests,backendCalls:0}));
}finally{await browser.close();}
