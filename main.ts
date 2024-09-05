import { getCheerio } from 'crawler/cheerio';

(async () => {
    const selector = await getCheerio('https://www.niceoppai.net/op/1124');
    console.log('getCheerio =====> ', selector)

    let content = selector('body').find('#image-container').find('img').toArray();
    console.log('content =====> ', content)

    let images = content.map((c) => ({
        href: selector(c).attr('src'),
    }));
    console.log('images =====> ', images)
})()

// CHEERIO, can load html get image list and download
// PUPPETEER, need to run js to get image list
// PUPPETEER_ON_WEB, blocked by cloudflare need to download from request on web and click button to show all image