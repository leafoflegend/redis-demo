import 'source-map-support/register'
import express from 'express';
import chalk from 'chalk';
import { db } from './db/index';
import api from './api/index';
import middleware from './middleware/index';
import redis from './redis/index';

const app = express();

app.use(express.json());
app.use(middleware);
app.use('/api', api);

const PORT = process.env.PORT || 3000;

const startServer = () => new Promise(res => app.listen(PORT, () => {
  console.log(chalk.green(`App now listening on PORT:${PORT}`));
  res();
}));

const startApp = async () => {
  try {
    await db.sync({force: false});

    console.log(chalk.green('Database synced.'));

    await redis.sync();

    console.log(chalk.green('Redis ready to serve.'));

    await startServer();

    console.log(chalk.green('Server now accepting requests.'));
  } catch (e) {
    console.log(chalk.red('Something went terribly wrong and your server wont be able to start.'));
    console.error(e);
  }
};

startApp();
