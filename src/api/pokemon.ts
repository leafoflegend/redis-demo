import { Router } from 'express';
import chalk from 'chalk';
import { Pokemon, UserPokemon } from '../db/index';
import redis from '../redis';

const pokemon = Router();

pokemon.get('/', async (req, res, next) => {
  console.log(chalk.yellow(`User Auth: ${req.headers.authorization}`));
  if (req.headers.authorization) {
    const userId = await redis.get(req.headers.authorization);

    console.log(chalk.yellow(`User Id: ${userId}`));

    const userPokemonIds = await UserPokemon.findAll({
      where: {
        UserId: userId,
      },
    });

    const userPokemon = await Promise.all(userPokemonIds.map(({ PokemonId }) => Pokemon.findByPk(PokemonId)));

    console.log(chalk.cyan(`Healing ${userPokemon.length} pokemon for user ${userId}. ${userPokemon.map(({ name }) => name).join(', ')}`));
    setTimeout(() => {
      res.send(userPokemon);
    }, 2500);
  } else {
    res.status(401).send({
      message: 'The authorization you sent didnt link to a user. You may need to re-register with your nearest pokemon center.',
    });
  }
});

export default pokemon;
