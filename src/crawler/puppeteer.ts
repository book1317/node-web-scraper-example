import puppeteer, { Page } from 'puppeteer'
import path from 'path';
import fs from 'fs';
import { IMangaImage, IInputProcessManga } from 'epic/manga';
import { isIncludeString, parseFilenames } from 'utils/string';

export async function getImagesListWithPuppeteer(url: string, { contentSelector, imageSelector, attrSelector }: IInputProcessManga) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url);
    await page.hover('body'); // some page need to hover first
    await page.waitForSelector(contentSelector, { timeout: 10000 });

    // await logPage(page);

    const images = await page.evaluate((imageSelector, attrSelector) => {
        const imageElements = document.querySelectorAll(imageSelector);
        return Array.from(imageElements).map((img) => ({
            href: img.getAttribute(attrSelector),
        }));
    }, imageSelector, attrSelector);

    await browser.close();
    return images as IMangaImage[];
}

export async function downloadImagesWithPuppeteerOnResponse(url: string, { contentSelector, imageSelector, buttonSelector, excludeFileName }: IInputProcessManga, downloadDirectory: string) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    let saveFileCount = 0;

    await page.goto(url);
    await page.hover('body'); // some page need to hover first
    await page.waitForSelector(contentSelector, { timeout: 10000 });

    const images = await page.evaluate((imageSelector) => {
        const imageElements = document.querySelectorAll(imageSelector);
        return Array.from(imageElements).map((img) => ({
            href: img.getAttribute('src'),
        }));
    }, imageSelector);

    page.on('response', async (response) => {
        const url = response.url();
        if (!url.endsWith('.jpg'))
            return;

        if (isIncludeString(url, excludeFileName)) {
            return;
        }

        if (response.request().resourceType() === 'image') {
            response.buffer().then(file => {
                const fileName = url.split('/').pop() ?? '';
                if (fileName.endsWith('.jpg')) {
                    console.log('fileName===>', fileName);
                    const filePath = path.resolve(downloadDirectory, parseFilenames(fileName));
                    const writeStream = fs.createWriteStream(filePath);
                    writeStream.write(file);
                    saveFileCount++;
                }
            });
        }
    });

    if (buttonSelector) {
        await page.click(buttonSelector);
    }

    async function waitForSaveFileCount() {
        let checkCount = 0;
        return new Promise((resolve, reject) => {
            const checkCondition = () => {
                checkCount++;
                console.log('images.length:' + images.length);
                console.log('saveFileCount:' + saveFileCount);
                console.log('checkCount:' + checkCount);

                if (checkCount >= 20) {
                    reject('TIMEOUT');
                }
                if (saveFileCount >= images.length) {
                    resolve('');
                } else {
                    setTimeout(checkCondition, 1000);
                }
            };

            checkCondition();
        });
    }

    await waitForSaveFileCount();
    await browser.close();
    return images as IMangaImage[];
}

async function logPage(page: Page) {
    const data = await page.evaluate(() => (document as any).querySelector('*').outerHTML);
    console.log(data);
}