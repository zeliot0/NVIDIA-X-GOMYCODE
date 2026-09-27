import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        page = await browser.new_page()
        
        # 1. Load Dashboard
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(1000)
        title = await page.title()
        print('Page loaded, title:', title)
        
        # 2. Click Cyber Defense Tools in Navbar
        await page.click('button:has-text("Tools")')
        await page.wait_for_timeout(800)
        heading = await page.inner_text('h1')
        print('Tools page heading:', heading)
        
        # 3. Test Incident Commander tab
        await page.click('button:has-text("Wire / Zelle Bank Fraud")')
        await page.wait_for_timeout(300)
        await page.click('button:has-text("Deploy Incident Response")')
        print('Waiting for incident response...')
        await page.wait_for_selector('text=Tactical Containment', timeout=20000)
        print('Incident response verified!')
        
        # 4. Test Dark Web Breach tab
        await page.click('button:has-text("Dark Web Breach")')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("High-Exposure Identity")')
        await page.wait_for_timeout(300)
        print('Waiting for breach check...')
        await page.wait_for_selector('text=Associated Breach Incidents', timeout=20000)
        print('Breach check verified!')
        
        # 5. Test Web3 Crypto Audit tab
        await page.click('button:has-text("Web3")')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("Permit2 Unlimited Drainer Signature")')
        print('Waiting for crypto audit...')
        await page.wait_for_selector('text=Web3 Threat Classification', timeout=20000)
        print('Crypto audit verified!')
        
        # 6. Test Psychology Radar tab
        await page.click('button:has-text("Psychology Radar")')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("IRS / Law Enforcement Intimidation")')
        print('Waiting for psych audit...')
        await page.wait_for_selector('text=Psychological Deconstruction', timeout=20000)
        print('Psychology radar verified!')
        
        # 7. Test Analyze page AI Voice Briefing & Psych Profile
        await page.click('button:has-text("Analyze")')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("Bank SMS")')
        await page.wait_for_timeout(300)
        await page.click('button:has-text("Analyze Security Risk")')
        print('Waiting for threat scan result...')
        await page.wait_for_selector('text=AI Cyber Voice Briefing', timeout=25000)
        print('AI Voice Briefing verified in AnalyzeCard!')
        
        has_psych_btn = await page.is_visible('text=Deconstruct Attack Psychology')
        print('Psychological Deconstruction button visible:', has_psych_btn)
        
        # Take a verification screenshot
        await page.screenshot(path='frontend_beast_verification.png', full_page=True)
        print('Screenshot captured to frontend_beast_verification.png!')
        
        await browser.close()
        print('>>> ALL BEAST CYBER DEFENSE FEATURES VERIFIED SUCCESSFULLY! <<<')

if __name__ == '__main__':
    asyncio.run(run())
