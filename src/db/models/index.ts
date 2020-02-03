import { DataTypes, Model } from 'sequelize';
import Pokemon, { DBPokemon } from './pokemon';
import User, { DBUser } from './user';
import db from '../db';

const { UUID, INTEGER } = DataTypes;

class UserPokemon extends Model {
  public pokemonId!: number;
  public userId!: string;
}

UserPokemon.init({
  pokemonId: {
    type: INTEGER,
    allowNull: false,
  },
  userId: {
    type: UUID,
    allowNull: false,
  },
}, {
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
