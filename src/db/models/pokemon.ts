import { Model, DataTypes, Association } from 'sequelize';
import User from './user';
import db from '../db';

const {
  STRING,
  INTEGER,
  ARRAY,
} = DataTypes;

export interface DBPokemon {
  id: number;
  name: string;
  types: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

class Pokemon extends Model {
  public id!: number;
  public name!: string;
  public types!: string[];
  public hp!: number;
  public attack!: number;
  public defense!: number;
  public special_attack!: number;
  public special_defense!: number;
  public speed!: number;

  public readonly users?: User[];
  public static associations: {
    users: Association<Pokemon, User>;
  };

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pokemon.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  types: {
    type: ARRAY(STRING),
    allowNull: false,
  },
  hp: {
    type: INTEGER,
    allowNull: false,
  },
  attack: {
    type: INTEGER,
    allowNull: false,
  },
  defense: {
    type: INTEGER,
    allowNull: false,
  },
  special_attack: {
    type: INTEGER,
    allowNull: false,
  },
  special_defense: {
    type: INTEGER,
    allowNull: false,
  },
  speed: {
    type: INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'pokemon',
  freezeTableName: true,
  sequelize: db,
});

export default Pokemon;
