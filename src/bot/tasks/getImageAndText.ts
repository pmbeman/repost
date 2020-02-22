import { launch } from 'puppeteer';
import { Cache } from '../Cache';
import { logger } from '../../logger';
import { PostContent } from '../../types';

export async function getImageAndText(
  redditUrl: string
): Promise<PostContent | undefined> {
  if (redditUrl.length === 0) return undefined;

  const browser = await launch({
    headless: true,
  });
  const page = await browser.newPage();

  page.goto(redditUrl);

  try {
    // wait until image posts are loaded
    await page.waitForSelector('img.ImageBox-image.media-element', {
      visible: true,
      timeout: 3000,
    });
    await page.waitFor(1000);
  } catch (err) {
    logger.error(
      `${err}. The subreddit '${redditUrl}' might not exist or doesnt contain any image posts.`
    );
    return undefined;
  }

  // get all image posts
  const imagePosts = await page.$$('img.ImageBox-image.media-element');

  // filter out ads and already used posts
  const filteredPosts = imagePosts.filter(async handle => {
    const data = await handle.evaluate(e => {
      return {
        target: e.getAttribute('target')!,
        src: e.getAttribute('src')!,
      };
    });
    return data.target !== '_blank' && !Cache.instance.has(data.src);
  });

  if (!filteredPosts) {
    return undefined;
  }

  // click image to open popup
  await page.waitFor(1000);
  await filteredPosts[0].click();
  await page.waitFor(1000);

  // get post content
  const image = await filteredPosts[0].evaluate(e => e.getAttribute('src'));
  const title = await page.evaluate(() => {
    return document.querySelectorAll('h1')[1].textContent;
  });

  await browser.close();

  if (image && title) {
    return {
      imageUrl: image.replace('preview', 'i'),
      caption: title,
    };
  } else {
    return undefined;
  }
}
