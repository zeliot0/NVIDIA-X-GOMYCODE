const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Launching automated browser for SAFEAI...');

  const screenshotsDir = path.join(__dirname, 'test_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // Launch visible browser (Edge) with slowMo so user can see every action
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false,
    slowMo: 900,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 850 },
  });

  const page = await context.newPage();

  console.log('1️⃣ Navigating to SAFEAI Home page...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '01_home.png') });

  console.log('2️⃣ Navigating to Analyze page...');
  await page.click('button:has-text("Scan Threat")');
  await page.waitForTimeout(1000);

  console.log('3️⃣ Testing Text Security Analyzer...');
  // Click sample button Bank SMS (EN)
  const bankSampleBtn = page.locator('button:has-text("Bank SMS (EN)")');
  if (await bankSampleBtn.isVisible()) {
    await bankSampleBtn.click();
    console.log('   Loaded Bank SMS sample');
  }

  // Click Analyze Security Risk
  console.log('   Clicking Analyze Security Risk...');
  await page.click('button:has-text("Analyze Security Risk")');
  await page.waitForSelector('text=CRITICAL RISK', { timeout: 10000 });
  console.log('   ✅ Phishing detection verified: CRITICAL RISK');
  await page.screenshot({ path: path.join(screenshotsDir, '02_text_phishing_result.png') });

  console.log('4️⃣ Testing Safe URL Analyzer...');
  // Switch to URL tab
  await page.click('button:has-text("Safe URL")');
  await page.waitForTimeout(800);

  // Click Raw IP Phishing sample
  const ipSampleBtn = page.locator('button:has-text("Raw IP Phishing")');
  if (await ipSampleBtn.isVisible()) {
    await ipSampleBtn.click();
    console.log('   Loaded Raw IP Phishing URL sample');
  }

  await page.click('button:has-text("Analyze Security Risk")');
  await page.waitForSelector('text=CRITICAL RISK', { timeout: 10000 });
  console.log('   ✅ URL analysis verified: Malicious URL intercepted');
  await page.screenshot({ path: path.join(screenshotsDir, '03_url_result.png') });

  console.log('5️⃣ Navigating to Security Dashboard...');
  await page.click('nav >> text=Dashboard');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '04_dashboard.png') });

  console.log('6️⃣ Navigating to Security History...');
  await page.click('nav >> text=History');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '05_history.png') });

  console.log('7️⃣ Navigating to Cyber Coach and asking a security question...');
  await page.click('nav >> text=Cyber Coach');
  await page.waitForTimeout(1000);

  // Click starter question button "Why should I never share an OTP?"
  const otpQuestionBtn = page.locator('button:has-text("Why should I never share an OTP?")').first();
  if (await otpQuestionBtn.isVisible()) {
    await otpQuestionBtn.click();
    console.log('   Sent question: "Why should I never share an OTP?"');
    await page.waitForSelector('text=Why you should NEVER share an OTP', { timeout: 15000 });
    console.log('   ✅ Cyber Coach answered successfully');
    await page.screenshot({ path: path.join(screenshotsDir, '06_coach_chat.png') });
  }

  console.log('🎉 All automated browser tasks completed successfully!');
  await page.waitForTimeout(4000);
  await browser.close();
})();
