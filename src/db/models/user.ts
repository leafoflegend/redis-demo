import { Model, DataTypes, Association } from 'sequelize';
import Pokemon from './pokemon';
import db from '../db';

const {
  STRING,
  UUID,
  UUIDV4,
  DATE,
} = DataTypes;

export interface DBUser {
  id: string;
  name: string;
  secret: string;
  lastSignIn: Date;
}

class User extends Model {
  public id!: string;
  public name!: string;
  public secret!: string;
  public lastSignIn!: Date;

  public readonly pokemon?: Pokemon[];
  public static associations: {
    pokemon: Association<User, Pokemon>;
  };

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  secret: {
    type: STRING,
    allowNull: false,
  },
  lastSignIn: {
    type: DATE,
  }
}, {
  tableName: 'users',
  freezeTableName: true,
  sequelize: db,
});

export default User;
