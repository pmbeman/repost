<p>
<img src="/media/logo.svg" width="200px">
</p>

> Post reddit content to instagram

## Usage

- Add new bot(s) to `./bots` exports
- Set arguments
- Run `npm start`

On a scheduled run a bot will scrape content from one of the subreddits and post it to the instagram account with given credentials.

### Bot Arguments

All bots are started and managed by pm2. Bot options are passed via arguments. You can either load bots on startup or start them from an [api endpoint](https://ig-repost-bot.herokuapp.com/documentation/static/index.html#/bot/post_api_bot).

**required**:

- `--subreddits`: List of subbredit names (comma seperated)
- `--schedule`: The bots posting schedule in crontab syntax (seconds granularity)
- `--insta`: The instragram credentials as `"username:password"`

**optional**:

- `--tags`: List of tag names (without #'s) included on every post (comma seperated)
- `--explore`: The bot will go to the instagram explore page and like content

the explore job runs on a random schedule

### Starting new Bots

On startup all the bots exported from `/bots` will be loaded. A bot config follows the [pm2 app declaration](https://pm2.keymetrics.io/docs/usage/application-declaration/#javascript-format) and must at least contain following properties:

```ts
export function memes() {
  return {
    name: 'memes',
    args: '--subreddits images --schedule "0 10 * * *" --insta user:pass',
  };
}
```

### Api endpoints

See [api documentation](https://ig-repost-bot.herokuapp.com/documentation)

## Development Setup

Clone the repository

> git clone https://github.com/KaindlJulian/repost.git

Install dependencies

> npm install

Running the app:

1. Use `npm run dev`. This will compile all files and start processes (bots and api) with pm2. The bots are specified in `bots/*`

2. Debug with vscode (see [launch.json](.vscode/launch.json))

When running the app with `NODE_ENV=development` api requests do not require an api key. Also the puppeteer launch config is not headless.

### Running Tests

You can run all tests with `npm run test` or debug tests with vscode.

- Click  [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/pmbeman/repost)
