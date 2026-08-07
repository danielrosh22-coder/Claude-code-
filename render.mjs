import { readFileSync, writeFileSync, existsSync } from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const FDIR = new URL('./.fonts/package/files/', import.meta.url).pathname;
const HEB = 'U+0590-05FF, U+200C-200F, U+FB1D-FB4F';
const LAT = 'U+0000-00FF, U+0131, U+0152-0153, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215';

function face(family, weight, file, range){
  const p = FDIR + file;
  if(!existsSync(p)) throw new Error('missing font '+p);
  const b64 = readFileSync(p).toString('base64');
  return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;`+
         `src:url(data:font/woff2;base64,${b64}) format('woff2');unicode-range:${range};}`;
}

let css = '';
for(const w of [400,500,700,800,900]){
  css += face('Heebo', w, `heebo-hebrew-${w}-normal.woff2`, HEB);
  css += face('Heebo', w, `heebo-latin-${w}-normal.woff2`, LAT);
}

const tpl = readFileSync(new URL('./story-caught.template.html', import.meta.url).pathname,'utf8');
const html = tpl.replace('/*__FONTS__*/', css);
writeFileSync(new URL('./story-caught.html', import.meta.url).pathname, html);

const browser = await chromium.launch({ args:['--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport:{ width:1080, height:1920 }, deviceScaleFactor:2 });
await page.goto('file://'+new URL('./story-caught.html', import.meta.url).pathname);
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(400);
const el = await page.$('.story');
await el.screenshot({ path: new URL('./story-caught.png', import.meta.url).pathname });
await browser.close();
console.log('rendered story-caught.png');
