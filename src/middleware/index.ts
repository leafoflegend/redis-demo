import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

const middleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(chalk.cyan(`Request: ${req.path}`));

  next();
};

export default middleware;
