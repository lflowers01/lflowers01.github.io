"""Study sculpture selection, fixed-grid decoding, drag/ripple and touch behavior."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = 'http://127.0.0.1:49280'


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=str(ROOT/'.local/chrome-for-testing/chrome-win64/chrome.exe'),headless=True)
        signatures = set()
        for index in range(4):
            page = await browser.new_page(viewport={'width':1440,'height':1000})
            errors=[]
            page.on('pageerror',lambda error:errors.append(str(error)))
            await page.add_init_script(f'Math.random=()=>{(index+.1)/4}')
            await page.route('**/api/visits',lambda r:r.fulfill(json={'visits':9}))
            await page.goto(BASE+'/home-study.html')
            await page.evaluate('document.fonts.ready')
            await page.wait_for_timeout(250)
            assert await page.locator('#hero-art').get_attribute('data-object-form')==str(index)
            for width in [390,1440]:
                await page.set_viewport_size({'width':width,'height':1000})
                await page.wait_for_timeout(120)
                data=await page.evaluate('''()=>{
                  const f=fields.find(f=>f.spins),g=f.objectField(performance.now(),7),points=[];
                  for(let i=0;i<g.light.length;i++)if(g.light[i]>.1)points.push([i%g.cols,Math.floor(i/g.cols)]);
                  return {count:points.length,inside:points.every(([x,y])=>x>0&&x<g.cols-1&&y>0&&y<Math.floor(f.height/7)-1),signature:points.slice(0,150).join('|')};
                }''')
                assert data['count']>150 and data['inside'],(index,width,data['count'])
                if width==1440:signatures.add(data['signature'])
            await page.locator('#hero-art').screenshot(path=str(ROOT/f'.git/sculpture-{index}.png'))
            point=await page.evaluate('''()=>{const f=fields.find(f=>f.spins),r=f.canvas.getBoundingClientRect();return{x:r.left+f.objectGeometry.cx,y:r.top+f.objectGeometry.cy}}''')
            await page.mouse.click(point['x'],point['y'])
            assert await page.evaluate('!!fields.find(f=>f.spins).objectTransition')
            # Rapid center clicks do not restart the transition.
            start=await page.evaluate('fields.find(f=>f.spins).objectTransition.start')
            await page.mouse.click(point['x'],point['y'])
            assert await page.evaluate('fields.find(f=>f.spins).objectTransition.start')==start
            grid=await page.evaluate('''()=>{
              const f=fields.find(f=>f.spins),draw=f.ctx.fillText,calls=[];
              f.ctx.fillText=function(text,x,y){calls.push({text,x,y});return draw.call(this,text,x,y)};
              f.draw(f.objectTransition.start+400);f.ctx.fillText=draw;
              return {scrambled:calls.some(p=>'01<>/+=:*#%'.includes(p.text)),fixed:calls.every(p=>Math.abs((p.x-3.5)/7-Math.round((p.x-3.5)/7))<.001&&Math.abs((p.y-3.5)/7-Math.round((p.y-3.5)/7))<.001)};
            }''')
            assert grid['scrambled'] and grid['fixed'],grid
            await page.wait_for_function('!fields.find(f=>f.spins).objectTransition')
            selected=await page.locator('#hero-art').get_attribute('data-object-form')
            assert selected!=str(index)
            await page.mouse.move(point['x'],point['y']);await page.mouse.down();await page.mouse.move(point['x']+60,point['y']+25,steps=6);await page.mouse.up()
            assert await page.locator('#hero-art').get_attribute('data-object-form')==selected
            assert await page.evaluate('fields.find(f=>f.spins).objectRotation.yaw>.4')
            await page.evaluate('''()=>{const f=fields.find(f=>f.spins);f.pointer=null;f.events=[];}''')
            outer=await page.evaluate('''()=>{const f=fields.find(f=>f.spins),r=f.canvas.getBoundingClientRect(),g=f.objectGeometry;return{x:r.left+g.cx+g.size*.7,y:r.top+g.cy}}''')
            await page.mouse.click(outer['x'],outer['y'])
            assert await page.evaluate('fields.find(f=>f.spins).events.length>0')
            assert await page.locator('#hero-art').get_attribute('data-object-form')==selected
            await page.emulate_media(reduced_motion='reduce');await page.locator('#hero-art').press('Enter')
            assert await page.locator('#hero-art').get_attribute('data-object-form')!=selected
            assert not await page.evaluate('fields.find(f=>f.spins).objectTransition')
            await page.emulate_media(reduced_motion='no-preference')
            await page.locator('#hero-art').press('Enter')
            assert await page.evaluate('!!fields.find(f=>f.spins).objectTransition')
            await page.emulate_media(reduced_motion='reduce')
            await page.wait_for_function('!fields.find(f=>f.spins).objectTransition')
            assert not errors,errors
            await page.close()
            print(f'Form {index}: fits desktop/mobile, scrambles on-grid, resolves, drags and ripples.',flush=True)
        assert len(signatures)==4
        touch=await browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce')
        await touch.goto(BASE+'/home-study.html');await touch.wait_for_timeout(250)
        canvas=touch.locator('#hero-art');await canvas.scroll_into_view_if_needed()
        point=await touch.evaluate('''()=>{const f=fields.find(f=>f.spins),r=f.canvas.getBoundingClientRect();return{x:r.left+f.objectGeometry.cx,y:r.top+f.objectGeometry.cy}}''')
        old=await canvas.get_attribute('data-object-form');await touch.touchscreen.tap(point['x'],point['y'])
        assert await canvas.get_attribute('data-object-form')!=old
        await touch.goto(BASE+'/');assert await touch.evaluate('fields.find(f=>f.spins).multiForm===false')
        await browser.close()
        print('All four silhouettes differ; touch selection works; main homepage keeps its original torus.')


asyncio.run(main())
