"""Footer text clearance shares the hero fade, including ripples and live counter changes."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]


async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path=str(ROOT/'.local/chrome-for-testing/chrome-win64/chrome.exe'))
        for width in [390,1440,2560]:
            page=await browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            await page.route('**/api/visits',lambda r:r.fulfill(json={'visits':123}))
            await page.goto('http://127.0.0.1:49280/',wait_until='networkidle')
            await page.evaluate('document.fonts.ready')
            assert await page.locator('.site-footer').evaluate('e=>{const r=e.getBoundingClientRect();return Math.abs(r.left)<1&&Math.abs(r.right-document.documentElement.clientWidth)<1}')
            assert await page.locator('.study-about-foot a').last.inner_text() == 'Contact me about Summer 2027 opportunities'
            for theme in ['oled','forest']:
                if await page.locator('body').get_attribute('data-theme')!=theme:
                    await page.locator('#theme-toggle').click()
                    await page.wait_for_function("!document.documentElement.classList.contains('theme-switching')")
                await page.locator('.footer-name').scroll_into_view_if_needed()
                result=await page.evaluate('''()=>{
                  const f=fields.find(f=>f.footer),c=f.canvas.getBoundingClientRect(),r=document.querySelector('.footer-name').getBoundingClientRect();
                  const bounds={left:r.left-c.left,right:r.right-c.left,top:r.top-c.top,bottom:r.bottom-c.top};
                  f.pulse((bounds.left+bounds.right)/2,(bounds.top+bounds.bottom)/2);
                  const draw=f.ctx.fillText,calls=[];
                  f.ctx.fillText=function(text,x,y){calls.push({x,y,alpha:this.globalAlpha});return draw.call(this,text,x,y)};
                  try{f.draw(performance.now()+300)}finally{f.ctx.fillText=draw}
                  const under=calls.filter(p=>p.x>=bounds.left&&p.x<=bounds.right&&p.y>=bounds.top&&p.y<=bounds.bottom);
                  return {covered:under.length,clear:under.every(p=>p.alpha<.001),art:calls.some(p=>p.alpha>.2)};
                }''')
                assert result['covered'] and result['clear'] and result['art'],(width,theme,result)
            row = await page.locator('.footer-bottom').bounding_box()
            x, y = row['x'] + row['width'] / 2, row['y'] + row['height'] / 2
            await page.mouse.move(x, y)
            assert await page.evaluate('''({x,y})=>{
              const f=fields.find(f=>f.footer),r=f.canvas.getBoundingClientRect();
              return f.pointer&&Math.abs(f.pointer.x-(x-r.left))<1&&Math.abs(f.pointer.y-(y-r.top))<1;
            }''', {'x':x,'y':y}), 'Footer row blocked the WALL-E pointer'
            await page.locator('#visit-count').evaluate("e=>e.textContent='Unavailable'")
            await page.wait_for_function('''()=>{
              const f=fields.find(f=>f.footer),c=f.canvas.getBoundingClientRect(),r=document.getElementById('visit-count').getBoundingClientRect();
              return f.textOpacity(r.right-c.left-2,(r.top+r.bottom)/2-c.top)<.001;
            }''')
            await page.locator('.site-footer').screenshot(path=str(ROOT/f'.git/footer-fade-{width}.png'))
            await page.goto('http://127.0.0.1:49280/about.html',wait_until='networkidle')
            assert await page.evaluate('fields.find(f=>f.footer).textRegions.length>0')
            assert not errors,errors
            await page.close()
        await browser.close()
        print('PASS: footer copy clears ASCII through ripples in OLED/forest at 390/1440/2560px with full-width footer; art remains visible, live counter changes refresh the fade, and reading pages work.')


asyncio.run(main())
