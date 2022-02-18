import { Application, Request, Response } from "express";
import { init } from "./gamma.strategy";
import cors from "cors";
import session, { MemoryStore } from "express-session";
import { PassportStatic } from "passport";
import { EnvironmentVariables } from "../env";

/**
 * Configures gamma oauth middleware and passport strategy.
 * @param app the express application
 * @param passport the passport instance
 * @param env the environment variables
 */
export function configureGammaAuth(
  app: Application,
  passport: PassportStatic,
  env: EnvironmentVariables
) {
  configureGammaAuthCors(app, env.clientHost);
  configureGammaAuthStrategy(env);
  configureGammaAuthSession(app, passport, env.clientSecret);
}

/**
 * Configures gamma strategy for passport.
 * @param options init options
 */
function configureGammaAuthStrategy({
  clientId,
  clientSecret,
  redirectUrl,
  gammaUrl,
  gammaLocalUrl,
}: EnvironmentVariables) {
  init(
    clientId,
    clientSecret,
    redirectUrl,
    gammaUrl,
    gammaLocalUrl ?? gammaUrl
  );
}

/**
 *
 * @param app the express application
 * @param passport the passport instance
 * @param clientSecret the client secret
 */
function configureGammaAuthSession(
  app: Application,
  passport: PassportStatic,
  clientSecret: string
) {
  app.use(
    session({
      secret: clientSecret,
      cookie: { maxAge: 86400000 },
      store: new MemoryStore(),
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
}

/**
 * Configures cors.
 * @param app the express application
 * @param origin the client host
 */
function configureGammaAuthCors(app: Application, origin: string) {
  app.use(
    cors({
      origin,
      credentials: true,
    })
  );
}
