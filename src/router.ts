import { Application } from "express";
import weather from "./presentation/router/weather";
import stateCapitals from "./presentation/router/capitals";

const routes = (app: Application): void => {
    weather(app);
    stateCapitals(app);
}

export default routes;