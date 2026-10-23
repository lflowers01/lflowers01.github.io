"""ASCII error page: actual HTTP 404, shared effects, responsive layout and fallback."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=str(ROOT/'.local/chrome-for-testing/chrome-win64/chrome.exe'))
  page=await browser.new_page(reduced_motion='reduce')
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  for width,height in [(320,740),(390,844),(995,871),(1920,1080),(844,390)]:
   await page.set_viewport_size({'width':width,'height':height})
   response=await page.goto('http://127.0.0.1:49280/missing-ascii-page')
   assert response.status==404
   await page.evaluate('document.fonts.ready')
   assert await page.locator('header,footer,nav').count()==0
   assert await page.locator('a').count()==1
   assert await page.get_by_role('link',name='Return home').get_attribute('href')=='/'
   assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   for theme in ['oled','forest']:
    await page.evaluate('(theme)=>{document.body.dataset.theme=theme}',theme)
    assert await page.evaluate('''()=>{
     const f=fields.find(f=>f.error),o=f.objectField(performance.now(),7);
     return o.light.some(v=>v>.5)&&o.light.some(v=>v===0)&&o.light.length===o.cols*o.rows;
    }''')
    await page.mouse.move(width*.5,height*.43)
    assert await page.evaluate('fields.find(f=>f.error).pointer!==null')
    await page.evaluate('fields.find(f=>f.error).events=[]')
    await page.mouse.click(width*.5,height*.43)
    assert await page.evaluate('fields.find(f=>f.error).events.length===1')
    await page.locator('#error-art').press('Enter')
    assert await page.evaluate('fields.find(f=>f.error).events.length===2')
    await page.screenshot(path=str(ROOT/f'.git/404-ascii-{width}-{theme}.png'))
   print(width,height,'both themes, shape and ripples passed',flush=True)
  await page.evaluate("localStorage.setItem('lf.theme.v1','forest')")
  await page.reload()
  assert await page.locator('body').get_attribute('data-theme')=='forest'
  await page.get_by_role('link',name='Return home').click()
  assert page.url=='http://127.0.0.1:49280/'
  nojs=await browser.new_page(java_script_enabled=False)
  await nojs.goto('http://127.0.0.1:49280/404.html')
  assert await nojs.locator('.error-fallback').is_visible()
  assert not errors,errors
  await browser.close()
  print('PASS: ASCII 404, real missing-page status, mouse/keyboard ripples, theme, return link and no-JS fallback.')
asyncio.run(main())
