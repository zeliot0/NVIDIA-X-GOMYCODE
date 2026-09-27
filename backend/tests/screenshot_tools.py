import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='msedge', headless=True)
        page = await browser.new_page()
        await page.goto('http://localhost:5173')
        await page.click('button:has-text("Tools")')
        await page.wait_for_timeout(800)
        # Preload and deploy incident response
        await page.click('button:has-text("Wire / Zelle Bank Fraud")')
        await page.wait_for_timeout(300)
        await page.click('button:has-text("Deploy Incident Response")')
        await page.wait_for_selector('text=Tactical Containment', timeout=20000)
        await page.wait_for_timeout(1000)
        await page.screenshot(path='frontend_tools_verification.png', full_page=True)
        print('Tools screenshot captured to frontend_tools_verification.png!')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
