import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='msedge', headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto('http://localhost:5173')
        await page.click('button:has-text("Dashboard")')
        await page.wait_for_timeout(1500)
        await page.screenshot(path='frontend_soc_dashboard.png', full_page=True)
        print('SOC Dashboard screenshot captured to frontend_soc_dashboard.png!')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
