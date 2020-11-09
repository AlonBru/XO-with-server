const puppeteer = require('puppeteer');

let browser;
let page;
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    sloMo:250,
  });
  page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  page.emulate({
    viewport: {
      width: 500,
      height: 2400
    }, 
    userAgent: ''
  });
});

describe('choose square with the right sign', () => {
  test('first click X second click O', async () => {
    await page.waitForSelector('.game-board', {visible:true});
    const div0= await page.$("[id=square_0]")
    await div0.click();
    const firstClick = await page.$eval('[id=square_0]', e => e.innerHTML);
    expect(firstClick).toBe('X');
    const div1= await page.$("[id=square_1]")
    await div1.click();
    const secondClick = await page.$eval('[id=square_1]', e => e.innerHTML);
    expect(secondClick).toBe('O');
  }, 16000);
});


describe('Can win', () => {
    test('the game have winner', async () => {
      await page.waitForSelector('.game-board');
      await page.click("[id=square_3]");
      await page.click("[id=square_8]");
      await page.click("[id=square_6]");
      await page.waitForSelector("[id='modal']", {visible:true})
    }, 16000);
  });

  afterAll(() => {
      browser.close();
  });