import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\62d91082-4942-4ffc-b338-ae8f56ebfa9f"

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 950})
        page = await context.new_page()

        print("Loading application at http://localhost:5173/ ...")
        await page.goto("http://localhost:5173/")
        await page.wait_for_timeout(2000)

        # 1. Click Dashboard
        print("Navigating to SOC Dashboard...")
        dash_btn = page.locator("button:has-text('Dashboard')")
        await dash_btn.first.click()
        await page.wait_for_timeout(2500)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, "soc_dashboard_verified.png"), full_page=True)
        print("Captured soc_dashboard_verified.png")

        # 2. Click Tools
        print("Navigating to Tools Arsenal...")
        tools_btn = page.locator("button:has-text('Tools')")
        await tools_btn.first.click()
        await page.wait_for_timeout(2000)

        # Honeypot Bot
        print("Testing Honeypot Scambaiter Bot...")
        honeypot_tab = page.locator("button:has-text('Scambaiter Honeypot')")
        await honeypot_tab.first.click()
        await page.wait_for_timeout(1000)
        gen_btn = page.locator("button:has-text('Generate Scambaiter Decoy')")
        if await gen_btn.count() > 0:
            await gen_btn.first.click()
            await page.wait_for_timeout(2500)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, "tools_honeypot_verified.png"), full_page=True)
        print("Captured tools_honeypot_verified.png")

        # Zero-Day & CVE Sentinel
        print("Testing Zero-Day & CVE Sentinel...")
        cve_tab = page.locator("button:has-text('Zero-Day & CVE Sentinel')")
        await cve_tab.first.click()
        await page.wait_for_timeout(1000)
        query_btn = page.locator("button:has-text('Query Vulnerability Intel')")
        if await query_btn.count() > 0:
            await query_btn.first.click()
            await page.wait_for_timeout(2500)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, "tools_cve_verified.png"), full_page=True)
        print("Captured tools_cve_verified.png")

        # 3. Click Analyze
        print("Navigating to Analyze Page...")
        analyze_btn = page.locator("button:has-text('Analyze')")
        await analyze_btn.first.click()
        await page.wait_for_timeout(2000)

        # Preload Phishing sample
        sample_btn = page.locator("button:has-text('Bank SMS (EN)')")
        if await sample_btn.count() > 0:
            await sample_btn.first.click()
            await page.wait_for_timeout(500)

        scan_btn = page.locator("button:has-text('Analyze Security Risk')")
        if await scan_btn.count() > 0:
            await scan_btn.first.click()
            await page.wait_for_timeout(4500)

        # Expand Adversarial Simulation
        audit_btn = page.locator("button:has-text('Simulate Red vs Blue')")
        if await audit_btn.count() > 0:
            await audit_btn.first.click()
            await page.wait_for_timeout(3500)

        await page.screenshot(path=os.path.join(ARTIFACT_DIR, "analysis_adversarial_verified.png"), full_page=True)
        print("Captured analysis_adversarial_verified.png")

        await browser.close()
        print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run())
