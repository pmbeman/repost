import dotenv from 'dotenv';
import pm2 from 'pm2';
import path from 'path';
import { logger } from './logger';
import * as bots from '../bots';

dotenv.config();

pm2.connect(true, (err) => {
  if (err) {
    logger.error('PM2 Connect Error', err);
    process.exit(1);
  }

  // start all the bots
  Object.values(bots).forEach((botGetter) => {
    const bot = botGetter();
    pm2.start(
      {
        script: path.join(__dirname, '/bot/index.js'),
        exec_mode: 'cluster',
        error: `${process.env.HOME}/.pm2/logs/${bot.name}.log`,
        output: `${process.env.HOME}/.pm2/logs/${bot.name}.log`,
        merge_logs: true,
        max_memory_restart: '200M',
        ...bot,
      },
      (err) => {
        if (err) {
          logger.error('PM2 Bot Startup error', {
            pm2: err.message,
            bot: bot.name,
          });
          throw err;
        }
      }
    );
  });

  // start the api
  pm2.start(
    {
      name: 'api',
      script: path.join(__dirname, '/api/index.js'),
      exec_mode: 'cluster',
      merge_logs: true,
      env: {
        API_KEY: process.env.API_KEY || '',
        NODE_ENV: process.env.NODE_ENV!,
      },
    },
    (err) => {
      if (err) {
        logger.error('PM2 Api Startup error', {
          pm2: err.message,
        });
        throw err;
      }
    }
  );

  // todo: convert callbacks to promises and await all
  setTimeout(() => {
    pm2.disconnect();
  }, 5000);
});
