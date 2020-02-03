import 'source-map-support/register'

import axios from 'axios';
import chalk from 'chalk';
import { Pokemon, db, DBPokemon } from '../index';

const POKEMON_URL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json';

interface GithubPokemon {
  id: number;
  name: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  },
  type: string[];
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    'Sp. Attack': number;
    'Sp. Defense': number;
    Speed: number;
  }
}

const seedPokemon = async () => {
  try {
    await db.sync({ force: true });

    const pokemon = await Pokemon.findAll();

    if (pokemon.length) return 0;

    const { data: pokemonJSON }: { data: GithubPokemon[] } = await axios.get(POKEMON_URL);

   const pokemonForInsertion = pokemonJSON.map<DBPokemon>((pokemon => ({
     id: pokemon.id,
     name: pokemon.name.english,
     types: pokemon.type,
     hp: pokemon.base.HP,
     attack: pokemon.base.Attack,
     defense: pokemon.base.Defense,
     special_attack: pokemon.base['Sp. Attack'],
     special_defense: pokemon.base['Sp. Defense'],
     speed: pokemon.base.Speed,
   })));

    const results = await Pokemon.bulkCreate(pokemonForInsertion);

    console.log(chalk.green(`Successfully seeded ${results.length} Pokemon!`));
  } catch (e) {
    console.log(chalk.red(`Unable to seed pokemon.`));
    console.error(e);
  }
};

if (process.env.SEED) {
  seedPokemon();
}

export default seedPokemon;
