import express from "express";
import { createServer, Server as HttpServer } from "http";
import errorHandler from "./errorHandler";
import routes from "./router";
import NotFoundError from "./utils/error/not-found-error";

export default class Server {
  public app: express.Application;
  public server: HttpServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupMiddlewares() {
    this.app.use(express.json());
  }

  private setupErrorHandler() {
    this.app.use((req, res, next) => {
      const error: NotFoundError = new NotFoundError("Route Not Found");
      next(error);
    });

    this.app.use(errorHandler);
  }

  private setupRoutes() {
    routes(this.app);
  }

  public start(port: number) {
    this.server.listen(port, () => {
      console.log(`🚀 App is running on port ${port}`);
    });
  }

  public close() {
    this.server.close();
  }
}
