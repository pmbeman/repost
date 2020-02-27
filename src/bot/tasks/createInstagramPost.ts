import { launch, Page } from 'puppeteer';
import { InstagramCredentials, PostContent } from '../../types';
import { logger } from '../../logger';

const INSTAGRAM_ULR = 'https://www.instagram.com/';
const INSTAGRAM_LOGIN_PAGE = `${INSTAGRAM_ULR}accounts/login/`;

export async function createInstagramPost(
  credentials: InstagramCredentials,
  content: PostContent
): Promise<boolean> {
  const browser = await launch({ headless: true });
  const page = await browser.newPage();

  const success = await loginInstagramAccount(page, credentials);

  if (!success) {
    return false;
  }

  await page.goto(`${INSTAGRAM_ULR}${credentials.username}`);

  // post content

  return true;
}

/**
 * Tries to login to instagram with given credentials
 * @returns {Promise<boolean>} resolves to `true` logged in succesfully
 */
export async function loginInstagramAccount(
  page: Page,
  credentials: InstagramCredentials
): Promise<boolean> {
  if (
    !credentials.username ||
    !credentials.password ||
    credentials.password.length < 6
  ) {
    return false;
  }

  await page.goto(INSTAGRAM_LOGIN_PAGE);

  await page.waitForSelector('[name=username]');

  // type in credentials and click submit
  await page.type('[name=username]', credentials.username);
  await page.type('[name=password', credentials.password);
  await page.click('[type=submit');

  await page.waitFor(3000);

  // check for login error
  const error = await page.$('#slfErrorAlert');
  if (error) {
    logger.warn('Instagram login failed with', credentials);
    return false;
  }
  return true;
}
