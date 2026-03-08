const { chromium } = require('./.playwright-tmp/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const base = 'http://127.0.0.1:10000';
  await page.goto(base + '/index.html', { waitUntil: 'domcontentloaded' });
  const homeLinks = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')).filter(Boolean));
  await page.goto(base + '/pages/spending.html', { waitUntil: 'domcontentloaded' });
  const spendingLinks = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')).filter(Boolean));
  console.log(JSON.stringify({
    homeHasFinancial: homeLinks.includes('pages/financial.html'),
    spendingHasFinancial: spendingLinks.includes('financial.html'),
    spendingHasLegal: spendingLinks.includes('legal.html')
  }, null, 2));
  await browser.close();
})();
