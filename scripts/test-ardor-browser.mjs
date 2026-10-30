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
 const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[],badRequests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)badRequests.push(r.status()+' '+r.url());});
 await page.goto(base+'/ardor/');
 await page.getByRole('heading',{level:1}).waitFor();
 assert.match(await page.title(),/^Ardor/);
 assert.equal(await page.getByRole('heading',{level:2}).count(),4,'The tour must show four chapters');
 const logo=page.locator('.brand img');
 await page.waitForFunction(()=>{const image=document.querySelector('.brand img');return image&&image.complete&&image.naturalWidth>0;});
 assert.ok((await logo.getAttribute('src')).includes('/ardor/favicon.svg'));

 const shots=page.locator('.shot-open');
 assert.equal(await shots.count(),6,'The tour must show six product captures');
 for(let index=0;index<await shots.count();index++){
   const button=shots.nth(index);
   const title=await button.getAttribute('data-title');
   await button.scrollIntoViewIfNeeded();
   await button.click();
   const dialog=page.locator('#shot-dialog[open]');
   await dialog.waitFor();
   assert.equal(await page.locator('#shot-title').textContent(),title);
   await page.waitForFunction(()=>{const image=document.querySelector('#shot-image');return image&&image.complete&&image.naturalWidth>0;});
   await page.locator('#shot-zoom').click();
   assert.ok(await dialog.evaluate(element=>element.classList.contains('is-zoomed')),'The original-size toggle must zoom the capture');
   await page.locator('#shot-zoom').click();
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#shot-dialog[open]').count(),0,'Escape must close the capture');
 }

 for(const width of [1440,900,390]){
   await page.setViewportSize({width,height:1080});
   await page.evaluate(()=>window.scrollTo(0,0));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`No overflow at ${width}`);
   await page.screenshot({path:`node_modules/.cache/ardor-showcase/showcase-${width}.png`,fullPage:true,animations:'disabled'});
 }

 await page.setViewportSize({width:390,height:844});
 const mobileShot=page.locator('.shot-open').first();
 await mobileShot.scrollIntoViewIfNeeded();
 await mobileShot.click();
 await page.locator('#shot-dialog[open]').waitFor();
 await page.waitForFunction(()=>{const image=document.querySelector('#shot-image');return image&&image.complete&&image.naturalWidth>0;});
 const bounds=await page.locator('#shot-dialog[open]').boundingBox();
 assert.ok(bounds&&bounds.width<=390&&bounds.x>=0,'The capture preview must fit a phone viewport');
 await page.keyboard.press('Escape');

 const requests=[];page.on('request',r=>requests.push(r.url()));
 await page.reload();
 assert.ok(!requests.some(url=>url.includes('/api/')),'Static showcase must not call a backend');
 await page.setViewportSize({width:1440,height:1080});
 await page.goto(base+'/');
 await page.getByRole('button',{name:'Open Ardor project details',exact:true}).click();
 assert.equal(await page.getByRole('link',{name:'PRODUCT TOUR',exact:true}).getAttribute('href'),'/ardor/');
 assert.deepEqual(errors,[]);assert.deepEqual(badRequests,[]);
 console.log(JSON.stringify({chapters:4,captures:6,viewports:[1440,900,390],errors,badRequests,backendCalls:0}));
}finally{await browser.close();}
