"""Fixed-clock sand, conservation/settling and real desk mode interactions."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=str(ROOT/'.local/chrome-for-testing/chrome-win64/chrome.exe'))
        engine = await browser.new_page()
        await engine.set_content('<div style="width:400px;height:600px"><canvas id="c" width="400" height="600"></canvas></div>')
        await engine.add_script_tag(path=str(ROOT/'assets/sand.js'))
        results = await engine.evaluate('''()=>{
          const canvas=document.getElementById('c');let queue=[];
          Object.defineProperty(performance,'now',{value:()=>0});
          window.requestAnimationFrame=fn=>{queue.push(fn);return queue.length+1};
          function seeded(){let n=42;Math.random=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296}}
          function fall(hz){seeded();queue=[];const s=new FallingSand(canvas,()=>{},()=>{});s.grain(200,20);s.setMode('sand');for(let i=1;i<=hz;i++){const fn=queue.shift();if(fn)fn(i*1000/hz)}return s.grid.findIndex(Boolean)}
          const fps=[fall(30),fall(60),fall(144)];
          seeded();const s=new FallingSand(canvas,()=>{},()=>{});s.enabled=true;s.pour={x:200,y:16};
          for(let i=0;i<480;i++)s.advance(1/120);s.pour=null;
          const count=()=>s.grid.reduce((a,b)=>a+b,0),mass=count();
          for(let i=0;i<1000;i++)s.advance(1/120);
          const conserved=count()===mass;
          const rows=Array.from({length:s.rows},(_,y)=>s.grid.slice(y*s.cols,(y+1)*s.cols).some(Boolean));
          const gaps=rows.slice(rows.indexOf(true)).some(v=>!v);
          const still=s.grid.join('');s.audioTarget=.9;let vibrates=false;
          for(let i=0;i<360;i++){s.advance(1/120);vibrates ||= s.grid.join('')!==still}
          const audioConserved=count()===mass;
          s.audioTarget=0;for(let i=0;i<1000;i++)s.advance(1/120);
          const rests=!s.advance(1/120);
          const copy=new FallingSand(canvas,()=>{},()=>{}),restored=copy.restore(s.snapshot())&&copy.grid.reduce((a,b)=>a+b,0)===mass;
          s.enabled=false;s.draining=true;for(let i=0;i<1500;i++)s.advance(1/120);
          return {fps,mass,conserved,gaps,vibrates,audioConserved,rests,restored,drained:count()===0};
        }''')
        assert len(set(results['fps'])) == 1, results
        assert results['mass'] > 100 and results['conserved'] and not results['gaps'], results
        assert results['vibrates'] and results['audioConserved'] and results['rests'], results
        assert results['restored'] and results['drained'], results
        await engine.close()

        page = await browser.new_page(viewport={'width':1440,'height':1100})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        await page.route('**/api/visits', lambda r: r.fulfill(json={'visits':123}))
        await page.goto('http://127.0.0.1:49280/',wait_until='networkidle')
        await page.evaluate('document.fonts.ready')
        await page.locator('#note-board').scroll_into_view_if_needed()
        point=await page.locator('#note-board').evaluate("e=>{const r=e.getBoundingClientRect();for(let y=r.top+30;y<Math.min(innerHeight,r.bottom)-40;y+=20)for(let x=r.left+25;x<r.right-120;x+=20)if(document.elementFromPoint(x,y)?.id==='note-drawing')return{x,y}}")
        assert point
        await page.mouse.move(point['x'],point['y']);await page.mouse.down()
        await page.mouse.move(point['x']+70,point['y']+8,steps=10);await page.mouse.up()
        await page.locator('#sand-toggle').click()
        assert await page.locator('#sand-toggle').get_attribute('aria-pressed') == 'true'
        assert await page.locator('#draw-mode').get_attribute('aria-pressed') == 'false'
        assert await page.locator('#sand-toggle').evaluate("e=>getComputedStyle(e).color===getComputedStyle(document.getElementById('clear-drawing')).color")
        await page.wait_for_function("()=>{const s=JSON.parse(localStorage.getItem('desk.lf.notes.sand.v1'));return s?.enabled&&s.cells.includes('1')&&s.cells.slice(-s.cols).includes('1')}",timeout=7000)
        assert await page.evaluate("JSON.parse(localStorage.getItem('desk.lf.notes.ink.v1')).length") == 0
        await page.reload(wait_until='networkidle')
        assert await page.locator('#sand-toggle').get_attribute('aria-pressed') == 'true'
        await page.locator('#draw-mode').click()
        assert await page.locator('#sand-toggle').get_attribute('aria-pressed') == 'false'
        await page.wait_for_function("()=>{const e=document.getElementById('note-drawing');return !e.getContext('2d').getImageData(0,0,e.width,e.height).data.some((v,i)=>i%4===3&&v)}",timeout=7000)
        await page.locator('#sand-toggle').click()
        await page.locator('#clear-drawing').click()
        assert not errors,errors
        await browser.close()
        print('PASS: identical sand at 30/60/144Hz, no settled row gaps, grain conservation, waveform-driven motion and pause settling, saved sand, conversion/draining, icon/color and browser mode switches.')


asyncio.run(main())
