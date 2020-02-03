import { promisify } from 'util';
import chalk from 'chalk';
import redis, { RedisClient } from 'redis';

class RedisClientError extends Error {
  public name: string = 'RedisClientError';

  constructor(message: string) {
    super(message);
  }
}

class NodeRedisClient {
  private client: RedisClient;
  private ready: boolean = false;

  constructor() {
    if (!process.env.REDIS_URL) {
      this.client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        password: process.env.REDIS_PASSWORD || undefined,
      });
    } else {
      this.client = redis.createClient(process.env.REDIS_URL);
    }
  }

  public sync() {
    return new Promise((res, rej) => {
      this.client.ping(e => {
        if (e) {
          console.log(chalk.red('Error syncing redis server.'));
          rej(e);
        } else {
          console.log(chalk.green('PONG!'));
          this.ready = true;
          res();
        }
      });
    });
  }

  public get(key: string) {
    if (!this.ready) throw new RedisClientError('Client not synced yet.')

    const promGet = promisify(this.client.get).bind(this.client);

    return promGet(key) as Promise<string>;
  }

  public set(key: string, value: string) {
    if (!this.ready) throw new RedisClientError('Client not synced yet.');

    const promSet = promisify(this.client.set).bind(this.client);

    return promSet(key, value);
  }

  public del(key: string) {
    if (!this.ready) throw new RedisClientError('Client not synced yet.');

    const promDel = promisify(this.client.del).bind(this.client);

    // @ts-ignore
    return promDel(key);
  }

  public hget(key: string, hash: string) {
    if (!this.ready) throw new RedisClientError('Client not synced yet.');

    const promHGet = promisify(this.client.hget).bind(this.client);

    return promHGet(key, hash) as Promise<string>;
  }

  public hset(key: string, hash: string, value: string) {
    if (!this.ready) throw new RedisClientError('Client not synced yet.');

    const promHSet = promisify(this.client.hset).bind(this.client);

    return promHSet(key, hash, value);
  }

  public hdel(key: string, hash: string) {
    if (!this.ready) throw new RedisClientError('Client not synced yet.');

    const promHDel = promisify(this.client.hdel).bind(this.client);

    // @ts-ignore
    return promHDel(key, hash);
  }

  public expire(key: string, time: number) {
    if (!this.ready) throw new RedisClientError('Client not synced yet.');

    const promExpire = promisify(this.client.expire).bind(this.client);

    return promExpire(key, time);
  }
}

const redisClient = new NodeRedisClient();

export default redisClient;
