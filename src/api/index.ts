import { Router, Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
import auth from './auth';
import users from './users';
import pokemon from './pokemon';

const api = Router();

api.use('/users', users);
api.use('/pokemon', pokemon);
api.use('/auth', auth);

api.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(chalk.red('Error while API was processing request.'));
  console.error(err);

  res.status(500).send({ error: err });
});

export default api;
