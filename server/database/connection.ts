import { Sequelize } from "sequelize-typescript";
import { MsSqlDialect } from "@sequelize/mssql";

import EnvManager from "../EnvManager";

const sequelize = new Sequelize({
  dialect: MsSqlDialect,
  server: EnvManager.getDbHost(),
  port: EnvManager.getDbPort(),
  database: EnvManager.getDbName(),
  authentication: {
    type: "default",
    options: {
      userName: EnvManager.getDbUsername(),
      password: EnvManager.getDbPassword(),
    },
  },
  models: [__dirname + "/models"],
});

export default sequelize;
