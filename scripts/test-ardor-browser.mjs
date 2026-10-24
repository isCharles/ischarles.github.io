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
 assert.equal(await page.getByRole('tab').count(),5,'Test must reach Ardor, not the portfolio fallback');
 for(const tab of await page.getByRole('tab').all()){
   await tab.click();
   await page.waitForFunction(()=>{const img=document.querySelector('#feature-image');return img.complete&&img.naturalWidth>0;});
   assert.equal(await tab.getAttribute('aria-selected'),'true');
   await page.locator('#screen-open').click();
   await page.locator('dialog[open]').waitFor();
   await page.waitForFunction(()=>{const img=document.querySelector('#dialog-image');return img.complete&&img.naturalWidth>0;});
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('dialog[open]').count(),0);
 }
 await page.getByRole('tab').first().focus();await page.keyboard.press('End');
 assert.equal(await page.getByRole('tab').last().getAttribute('aria-selected'),'true');
 await page.keyboard.press('Home');
 assert.equal(await page.getByRole('tab').first().getAttribute('aria-selected'),'true');
 for(const width of [1440,900,390]){
   await page.setViewportSize({width,height:1080});
   await page.evaluate(()=>window.scrollTo(0,0));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`No overflow at ${width}`);
   await page.screenshot({path:`node_modules/.cache/ardor-showcase/showcase-${width}.png`,fullPage:true,animations:'disabled'});
 }
 const requests=[];page.on('request',r=>requests.push(r.url()));
 await page.reload();
 assert.ok(!requests.some(url=>url.includes('/api/')),'Static showcase must not call a backend');
 await page.goto(base+'/');
 await page.getByRole('button',{name:'Open Ardor project details',exact:true}).click();
 assert.equal(await page.getByRole('link',{name:'PRODUCT TOUR',exact:true}).getAttribute('href'),'/ardor/');
 assert.deepEqual(errors,[]);assert.deepEqual(badRequests,[]);
 console.log(JSON.stringify({tabs:5,viewports:[1440,900,390],errors,badRequests,backendCalls:0}));
}finally{await browser.close();}
