const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Running visual verification of new Beast features & Dark/Light mode...');

  const screenshotsDir = path.join(__dirname, 'test_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false,
    slowMo: 600,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  const page = await context.newPage();

  console.log('1️⃣ Loading Dashboard with Cyber Health Score...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.click('nav >> text=Dashboard');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '07_dashboard_health_score.png') });

  console.log('2️⃣ Toggling to Light Mode...');
  const themeToggle = page.locator('button[title*="Light Mode"], button[title*="Dark Mode"]');
  await themeToggle.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '08_light_mode_dashboard.png') });

  console.log('3️⃣ Testing Tools: Password Sentinel in Light Mode...');
  await page.click('nav >> text=Tools');
  await page.waitForTimeout(800);
  // Click Quantum Grade Passphrase button
  await page.click('button:has-text("Quantum Grade Passphrase")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '09_password_sentinel.png') });

  console.log('4️⃣ Testing Tools: Header Sentry...');
  await page.click('button:has-text("Header Sentry")');
  await page.waitForTimeout(600);
  await page.click('button:has-text("Load Spoofed Bank Header")');
  await page.click('button:has-text("Inspect Email Headers")');
  await page.waitForSelector('text=SPF Check', { timeout: 8000 });
  await page.screenshot({ path: path.join(screenshotsDir, '10_header_sentry_spoof.png') });

  console.log('5️⃣ Toggling back to Cyber Dark Mode...');
  await themeToggle.click();
  await page.waitForTimeout(600);

  console.log('6️⃣ Testing Cyber Arena Simulator...');
  await page.click('nav >> text=Arena');
  await page.waitForTimeout(800);
  // Choose Dangerous / Malicious Scam on first question
  await page.click('button:has-text("Dangerous / Malicious Scam")');
  await page.waitForSelector('text=Correct Analysis!', { timeout: 8000 });
  await page.screenshot({ path: path.join(screenshotsDir, '11_arena_scenario.png') });

  console.log('7️⃣ Testing Live Threat Radar...');
  await page.click('nav >> text=Radar');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '12_threat_radar.png') });

  console.log('🎉 Verification complete!');
  await page.waitForTimeout(2000);
  await browser.close();
})();
