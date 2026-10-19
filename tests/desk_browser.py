"""Desk variant: object/note dragging, isolated persistence, ink and player controls."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=str(ROOT/'.local/chrome-for-testing/chrome-win64/chrome.exe'))
        page = await browser.new_page(viewport={'width':1440,'height':1100})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        await page.route('**/api/visits', lambda r: r.fulfill(json={'visits':123}))
        await page.add_init_script("localStorage.setItem('lf.board.positions.v1',JSON.stringify({unchanged:{x:.1,y:.2}}))")
        await page.goto('http://127.0.0.1:49280/', wait_until='networkidle')
        await page.evaluate('document.fonts.ready')
        for selector in ['[data-desk-handle]', '.note-handle']:
            handle = page.locator(selector).first
            await handle.scroll_into_view_if_needed()
            await handle.focus()
            await handle.press('ArrowRight')
            box = await handle.bounding_box()
            await page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
            await page.mouse.down()
            assert await handle.evaluate("e=>getComputedStyle(e).outlineStyle") == 'none'
            await page.mouse.move(box['x']+box['width']/2+25,box['y']+box['height']/2-12,steps=8)
            await page.mouse.up()
        saved = await page.evaluate("localStorage.getItem('desk.items.v1')")
        assert saved and 'ipod' in saved
        assert await page.evaluate("localStorage.getItem('desk.lf.board.positions.v1')")
        assert await page.evaluate("JSON.parse(localStorage.getItem('lf.board.positions.v1')).unchanged.y") == .2
        await page.reload(wait_until='networkidle')
        assert await page.evaluate("localStorage.getItem('desk.items.v1')") == saved
        await page.locator('#music-menu').click()
        assert await page.locator('#music-main-menu').is_visible()
        await page.locator('[data-ipod-view=settings]').click()
        assert await page.locator('#music-settings').is_visible()
        await page.locator('#music-menu').click(); await page.locator('#music-menu').click()
        await page.locator('#note-board').scroll_into_view_if_needed()
        point = await page.locator('#note-board').evaluate("e=>{const r=e.getBoundingClientRect();for(let y=r.top+20;y<Math.min(innerHeight,r.bottom)-20;y+=20)for(let x=r.left+20;x<r.right-40;x+=20)if(document.elementFromPoint(x,y)?.id==='note-drawing')return{x,y}}")
        assert point
        await page.mouse.move(point['x'],point['y']); await page.mouse.down()
        await page.mouse.move(point['x']+20,point['y']+8,steps=4); await page.mouse.up()
        assert await page.evaluate("JSON.parse(localStorage.getItem('desk.lf.notes.ink.v1')).length") == 1
        await page.locator('#clear-drawing').click()
        assert await page.evaluate("JSON.parse(localStorage.getItem('desk.lf.notes.ink.v1')).length") == 0
        for width in [1920,1024,768,390,320]:
            await page.set_viewport_size({'width':width,'height':1000})
            await page.wait_for_timeout(150)
            assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth'), width
        await page.goto('http://127.0.0.1:49280/',wait_until='networkidle')
        assert await page.locator('#note-board').is_visible()
        await page.locator('.desk-study').screenshot(path=str(ROOT/'.git/desk-mobile.png'))
        await page.goto('http://127.0.0.1:49280/classic.html',wait_until='networkidle')
        assert await page.locator('#music').count() == 1 and await page.locator('#board-section').count() == 1
        assert not await page.locator('.desk-surface').count()
        await page.evaluate('localStorage.clear()')
        for width in [1920,1440,1024,768,700,390,320]:
            await page.set_viewport_size({'width':width,'height':1000})
            await page.goto('http://127.0.0.1:49280/',wait_until='networkidle')
            await page.evaluate('document.fonts.ready')
            await page.wait_for_timeout(150)
            boxes = await page.locator('.sticky').evaluate_all('es=>es.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom}})')
            for i,a in enumerate(boxes):
                for b in boxes[i+1:]:
                    assert a['right']<=b['x'] or b['right']<=a['x'] or a['bottom']<=b['y'] or b['bottom']<=a['y'], (width,boxes)
            assert await page.locator('.desk-object').count() == 0
        assert not errors, errors
        await browser.close()
        print('PASS: desk objects/notes drag and keyboard movement, isolated saved state, reload, ink/clear, music menus, 1920–320px widths, and retained classic fallback; no JS errors.')


asyncio.run(main())
