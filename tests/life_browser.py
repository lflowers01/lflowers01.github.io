"""Conway rules, pixel reuse and saved desk mode controls in Chrome."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=str(ROOT/'.local/chrome-for-testing/chrome-win64/chrome.exe'))
        page = await browser.new_page()
        await page.set_content('<div style="width:40px;height:40px"><canvas id="c"></canvas></div>')
        await page.add_script_tag(path=str(ROOT/'assets/sand.js'))
        result = await page.evaluate('''()=>{
          window.requestAnimationFrame=()=>1;
          const s=new FallingSand(document.getElementById('c'),()=>{},()=>{});
          const seed=points=>{s.clear();points.forEach(([x,y])=>s.grain(x*4,y*4))};
          const cells=()=>Array.from(s.grid, (v,i)=>v?i:-1).filter(i=>i>=0).join(',');
          s.setMode('life');seed([[4,3],[4,4],[4,5]]);
          s.advance(.15);const horizontal=cells()==='43,44,45';
          s.advance(.15);const vertical=cells()==='34,44,54';
          seed([[3,3],[4,3],[3,4],[4,4]]);const block=cells();
          const stable=!s.advance(.15)&&cells()===block;
          const saved=s.snapshot(), copy=new FallingSand(s.canvas,()=>{},()=>{});
          const restored=copy.restore(saved)&&copy.life&&copy.grid.join('')===s.grid.join('');
          s.setMode('draw');s.advance(1);const frozen=s.frozen&&cells()===block;
          const frozenCopy=new FallingSand(s.canvas,()=>{},()=>{});
          const frozenRestored=frozenCopy.restore(s.snapshot())&&frozenCopy.frozen&&!frozenCopy.enabled;
          s.setMode('sand');const reused=cells()===block&&!s.life;
          seed([[0,0],[9,0],[0,9]]);s.setMode('life');s.advance(.15);
          const edges=!s.grid.some(Boolean);
          return {horizontal,vertical,stable,restored,frozen,frozenRestored,reused,edges};
        }''')
        assert all(result.values()), result
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        await page.route('**/api/visits', lambda r: r.fulfill(json={'visits':123}))
        await page.goto('http://127.0.0.1:49280/',wait_until='networkidle')
        # Seed a stable block in the existing storage format, then restore through the real UI.
        await page.evaluate('''()=>{
          const b=document.getElementById('note-board'),cols=Math.floor(b.clientWidth/4),rows=Math.floor(b.clientHeight/4),cells=Array(cols*rows).fill('0');
          for(const i of [cols*10+10,cols*10+11,cols*11+10,cols*11+11])cells[i]='1';
          localStorage.setItem('desk.lf.notes.sand.v1',JSON.stringify({mode:'life',enabled:true,cols,rows,cells:cells.join('')}));
        }''')
        await page.reload(wait_until='networkidle')
        assert await page.locator('#life-mode').get_attribute('aria-pressed') == 'true'
        assert await page.locator('[data-desk-mode][aria-pressed=true]').count() == 1
        snapshot = await page.evaluate("localStorage.getItem('desk.lf.notes.sand.v1')")
        await page.locator('#life-mode').click()
        assert await page.evaluate("localStorage.getItem('desk.lf.notes.sand.v1')") == snapshot
        await page.locator('#draw-mode').click()
        assert await page.evaluate("JSON.parse(localStorage.getItem('desk.lf.notes.sand.v1')).frozen")
        await page.locator('#sand-toggle').click()
        await page.locator('#life-mode').click()
        await page.locator('#clear-drawing').click()
        assert await page.locator('#life-mode').get_attribute('aria-pressed') == 'true'
        assert await page.evaluate("!JSON.parse(localStorage.getItem('desk.lf.notes.sand.v1')).cells.includes('1')")
        for width in [390,320]:
            await page.set_viewport_size({'width':width,'height':900})
            assert await page.locator('.drawing-modes').evaluate('e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}')
        assert not errors, errors
        await browser.close()
        print('PASS: Life blinker, stable block, dead edges, pixel reuse, frozen drawing, persistence, exclusive mode buttons, clear and mobile controls.')


asyncio.run(main())
