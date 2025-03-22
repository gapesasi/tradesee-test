import { initializeDataSource } from "./infra/database/DataSource";
import Server from "./server";

const _port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const server = new Server();

initializeDataSource(() => {
  server.start(_port);
}).catch((err) => console.error("initializeDataSource", err));
