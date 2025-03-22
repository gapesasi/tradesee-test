
import { Application } from "express";
import ExpressRouterAdapter from "../../main/adapters/ExpressRouterAdapter";
import GetStateCapitalsComposer from "../../main/composer/state-capitals/GetStateCapitals";

export default (app: Application): void => {
  app.get(
    "/state-capitals",
    ExpressRouterAdapter.adapt(GetStateCapitalsComposer.compose())
  );
};
