// import puppeteer from "puppeteer";
// import pLimit from "p-limit";
//
// export async function scrapeLongLat(url: string): Promise<{ lat: number; lon: number } | null> {
//     const browser = await puppeteer.launch({headless: true});
//     const page = await browser.newPage();
//
//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//         url = "https://" + url;
//     }
//
//     await page.goto(url, {
//         waitUntil: "networkidle0",
//     });
//
//     const coords = await page.evaluate(() => {
//         const match = document.body.innerText.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
//         return match ? {lat: parseFloat(match[1]), lon: parseFloat(match[2])} : null;
//     });
//
//     await browser.close();
//     return coords;
// }
//
// export async function scrapeManyWithLimit(urls: string[], concurrency = 5) {
//     const limit = pLimit(concurrency);
//     const browser = await puppeteer.launch({headless: true});
//
//     const tasks = urls.map((rawUrl) =>
//         limit(async () => {
//             const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
//             const page = await browser.newPage();
//             try {
//                 await page.goto(url, {waitUntil: 'networkidle0', timeout: 15000});
//
//                 const coords = await page.evaluate(() => {
//                     const match = document.body.innerText.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
//                     return match ? {lat: parseFloat(match[1]), lon: parseFloat(match[2])} : null;
//                 });
//
//                 await page.close();
//                 return coords;
//             } catch (err) {
//                 console.error(`Failed to scrape ${url}:`, err);
//                 await page.close();
//                 return null;
//             }
//         })
//     );
//
//     const results = await Promise.all(tasks);
//     await browser.close();
//     return results;
// }
