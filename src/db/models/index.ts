import { DataTypes, Model } from 'sequelize';
import Pokemon, { DBPokemon } from './pokemon';
import User, { DBUser } from './user';
import db from '../db';

const { UUID, INTEGER } = DataTypes;

class UserPokemon extends Model {
  public PokemonId!: number;
  public UserId!: string;
}

UserPokemon.init(
  {},
  {
  timestamps: false,
  tableName: 'UserPokemon',
  freezeTableName: true,
  sequelize: db,
});

Pokemon.belongsToMany(User, { through: UserPokemon });
User.belongsToMany(Pokemon, { through: UserPokemon });

export {
  Pokemon,
  DBPokemon,
  User,
  DBUser,
  UserPokemon,
}
