import dotenv from "dotenv";
import { join } from "path";
import { DataSource, EntityManager } from "typeorm";
import * as entities from "../../domain/models";

dotenv.config();

const {
  DATABASE_PASSWORD = "",
  DATABASE_NAME,
  DATABASE_HOST = "database",
  DATABASE_USERNAME,
} = process.env;

const dataSource = new DataSource({
  type: "mysql",
  port: 3306,
  host: DATABASE_HOST,
  database: DATABASE_NAME,
  password: DATABASE_PASSWORD,
  username: DATABASE_USERNAME,
  connectorPackage: "mysql2",
  entities,
  migrations: [join(__dirname, "/migrations", "*.{ts,js}")],
  migrationsRun: true,
  synchronize: false,
});

export const initializeDataSource = (callback: () => void): Promise<void> =>
  dataSource
    .initialize()
    .then(() => {
      console.info("TypeORM connected");
      callback();
    })
    .catch((err) => console.error(`TypeORM initialize error: ${err}`));

export const entityManager = new EntityManager(dataSource);

export default dataSource;
