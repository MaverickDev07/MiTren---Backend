import { Sequelize } from "sequelize-typescript";
import Debug from "debug";

import EnvManager from "../EnvManager";

process.env.DEBUG_COLORS = "true";

const debug = Debug("app:database");
const dError = Debug("app:error");
dError.color = "1";

const sequelize = new Sequelize({
  dialect: "mssql",
  database: EnvManager.getDbName(),
  username: EnvManager.getDbUsername(),
  password: EnvManager.getDbPassword(),
  host: EnvManager.getDbHost(),
  port: EnvManager.getDbPort(),
  dialectOptions: {
    options: {
      encrypt: true, // Utiliza el cifrado de SQL Server
      trustServerCertificate: true, // Solo para desarrollo
    },
  },
  models: [__dirname + "/models"],
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    debug("Connection has been established successfully.");
  } catch (error) {
    dError(`Unable to connect to the database: ${error}`);
  }
}

testConnection();

export default sequelize;
