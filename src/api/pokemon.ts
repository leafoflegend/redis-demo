import { Router } from 'express';
import { User, Pokemon } from '../db/index';
import redis from '../redis';

const pokemon = Router();

pokemon.get('/', async (req, res, next) => {
  if (req.headers.authorization) {
    const userId = await redis.get(req.headers.authorization);

    const user = await User.findByPk(userId, {
      include: [Pokemon],
    });

    if (user) {
      res.send(user.pokemon);
    } else {
      res.send({
        message: 'The authorization you sent didnt link to a user. You may need to re-register with your nearest pokemon center.',
      });
    }
  } else {
    res.sendStatus(401);
  }
});

export default pokemon;
