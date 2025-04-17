import { Sequelize } from "sequelize";
import DBConfig from "./config"


const SequelizeDB = new Sequelize(
  DBConfig.DATABASE,
  DBConfig.USERNAME,
  DBConfig.PASSWORD,
  {
    host: DBConfig.HOST,
    dialect: DBConfig.DIALECT as any,
    port: DBConfig.PORT,
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
      paranoid: true,
    },
    timezone: "+07:00",
  }
)

export default SequelizeDB;
