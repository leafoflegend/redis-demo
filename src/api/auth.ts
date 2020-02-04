import { Router } from 'express';
import chalk from 'chalk';
import faker from 'faker';
import { Sequelize } from 'sequelize';
import { Pokemon, User, UserPokemon } from '../db/index';
import redis from '../redis';

const auth = Router();

const HOUR = 60 * 60;

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
      await redis.expire(secret, HOUR);

      const selectedPokemon = await Pokemon.findAll({
        order: Sequelize.literal('random()'),
        limit: 6,
      });

      const usersPokemon = await UserPokemon.bulkCreate(
        selectedPokemon.map(pokemon => ({
          PokemonId: pokemon.id,
          UserId: user.id,
        }))
      );

      res.status(202).send({
        message: 'You have successfully registered as a new pokemon trainer. Please use the secret created for you to communicate with us in the future. Add it as the value for the "authorization" header.',
        secret,
      });
    } else {
      const secret = headers.authorization;
      const userId = await redis.get(secret);

      if (userId) {
        const user = await User.findByPk(userId);

        if (user) {
          await user.update({
            lastSignIn: Date.now(),
          });
          await redis.expire(secret, HOUR);

          res.status(201).send({ message: 'Thanks for visiting us again at the Poke-Center! We have extended your trainers license by one hour.' });
        }

        return;
      } else {
        const userBySecret = await User.findOne({
          where: {
            secret,
          }
        });

        if (!userBySecret) {
          console.log(chalk.red(`User not found using secret ${secret}`));
          res.status(400).send(`Youll have to re-register with us! Sorry for the inconvenience.`);
          return;
        }

        const newSecret = faker.company.bs();

        await userBySecret.update({
          secret: newSecret,
          lastSignIn: Date.now(),
        });
        await redis.set(newSecret, userBySecret.id);
        await redis.expire(newSecret, HOUR);
        res.status(202).send({
          message: 'Welcome back to the Poke-Center! Your license had expired so weve gone and printed you a new one! Please use your new secret to communicate with us from now on.',
          secret: newSecret,
        });
      }
    }
  } catch (e) {
    console.log(chalk.red('Something went wrong during the registration process.'));
    console.error(e);
    res.sendStatus(500);
  }
});

export default auth;
