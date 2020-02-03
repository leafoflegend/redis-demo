import { Router } from 'express';
import chalk from 'chalk';
import faker from 'faker';
import { Sequelize } from 'sequelize';
import { Pokemon, User, UserPokemon } from '../db/index';
import redis from '../redis';

const auth = Router();

auth.get('/register', async (req, res, next) => {
  const headers = req.headers;

  try {
    if (!headers.authorization) {
      const secret = faker.company.bs();

      const user = await User.create({
        lastSignIn: Date.now(),
        secret,
      });

      await redis.set(secret, user.id);
      await redis.expire(secret, 30);

      const selectedPokemon = await Pokemon.findAll({
        order: Sequelize.literal('rand()'),
        limit: 6,
      });

      const usersPokemon = await UserPokemon.bulkCreate(
        selectedPokemon.map(pokemon => ({
          pokemonId: pokemon.id,
          userId: user.id,
        }))
      );

      res.status(200).send({
        message: 'You have successfully registered as a new pokemon trainer. Please use the secret created for you to communicate with us in the future. Add it as the value for the "authorization" header.',
        secret,
      });
    } else {
      const userId = await redis.get(headers.authorization);

      if (userId) {
        const user = await User.findByPk(userId);

        if (user) {
          await user.update({
            lastSignIn: Date.now(),
          });
          await redis.expire(headers.authorization, 30);

          res.status(200).send({message: 'Thanks for re-registering with the Poke-Center! We have renewed your pokemon license.'});
          return;
        }
      }

      console.log(chalk.red(`User not found using secret ${headers.authorization}`));
      await redis.del(headers.authorization);
      res.status(200).send(`Youll have to re-register with us! Sorry for the inconvenience.`);
    }
  } catch (e) {
    console.log(chalk.red('Something went wrong during the registration process.'));
    console.error(e);
    res.sendStatus(500);
  }
});

export default auth;
