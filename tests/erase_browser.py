"""Erase drains sand and dissolves stationary pen/Life pixels without changing the mode."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]
PIXELS='''()=>{
  const e=document.getElementById('note-drawing'),d=e.getContext('2d').getImageData(0,0,e.width,e.height).data,cells=[];
  for(let y=2;y<e.height;y+=4)for(let x=2;x<e.width;x+=4)if(d[(y*e.width+x)*4+3])cells.push([x,y]);
  return cells;
}'''


async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path=str(ROOT/'.local/chrome-for-testing/chrome-win64/chrome.exe'))
        for mode in ['sand','life','draw']:
            page=await browser.new_page(viewport={'width':1440,'height':1100},reduced_motion='reduce')
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            await page.route('**/api/visits',lambda r:r.fulfill(json={'visits':123}))
            await page.goto('http://127.0.0.1:49280/',wait_until='networkidle')
            await page.evaluate('document.fonts.ready')
            await page.evaluate('''mode=>{
              const b=document.getElementById('note-board'),cols=Math.floor(b.clientWidth/4),rows=Math.floor(b.clientHeight/4),cells=Array(cols*rows).fill('0');
              for(let y=20;y<60;y+=4)for(let x=20;x<60;x+=4)for(const [dx,dy] of [[0,0],[1,0],[0,1],[1,1]])cells[(y+dy)*cols+x+dx]='1';
              localStorage.setItem('desk.lf.notes.sand.v1',JSON.stringify({mode,enabled:mode!=='draw',cols,rows,cells:mode==='draw'?'0'.repeat(cells.length):cells.join('')}));
              localStorage.setItem('desk.lf.notes.ink.v1',JSON.stringify(mode==='draw'?[[{x:.1,y:.2},{x:.3,y:.2}]]:[]));
            }''',mode)
            await page.reload(wait_until='networkidle')
            await page.locator('#clear-drawing').scroll_into_view_if_needed()
            before=await page.evaluate(PIXELS)
            assert before,mode
            arrangement=await page.evaluate("[localStorage.getItem('desk.items.v1'),localStorage.getItem('desk.lf.board.positions.v1')]")
            await page.locator('#clear-drawing').click()
            initial=await page.evaluate(PIXELS)
            assert initial,'Erase must animate, not instantly remove pixels'
            saved=await page.evaluate("JSON.parse(localStorage.getItem('desk.lf.notes.sand.v1'))")
            assert not saved['cells'] or '1' not in saved['cells']
            await page.wait_for_timeout(250)
            during=await page.evaluate(PIXELS)
            assert during,mode
            if mode=='sand':
                assert sum(y for _,y in during)/len(during)>sum(y for _,y in initial)/len(initial), 'Sand must move downward'
            else:
                assert len(during)<len(initial), 'Dissolve must progressively erase pixels'
                assert set(map(tuple,during))<=set(map(tuple,before)), 'Dissolving pixels must stay in place'
                assert await page.evaluate("JSON.parse(localStorage.getItem('desk.lf.notes.ink.v1')).length")==0
            await page.wait_for_function('('+PIXELS+')().length===0',timeout=7000)
            selector={'sand':'#sand-toggle','life':'#life-mode','draw':'#draw-mode'}[mode]
            assert await page.locator(selector).get_attribute('aria-pressed')=='true'
            assert await page.evaluate("[localStorage.getItem('desk.items.v1'),localStorage.getItem('desk.lf.board.positions.v1')]")==arrangement
            await page.reload(wait_until='networkidle')
            assert not await page.evaluate(PIXELS),'Erased pixels must not return on reload'
            assert await page.locator(selector).get_attribute('aria-pressed')=='true'
            assert not errors,errors
            await page.close()
        await browser.close()
        print('PASS: Erase drains sand, dissolves pen/Life in place, preserves the selected mode and item positions, and stays cleared after reload.')


asyncio.run(main())
