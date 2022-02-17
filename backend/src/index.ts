import "reflect-metadata";
import express from "express";
import passport from "passport";
import { configureGammaAuth } from "./auth";
import { Application } from "express-serve-static-core";
import { environment } from "./env";
import { configureGammaAuthRoutes, configureGraphQLRoute } from "./routes";
import { schema } from "./graphql/schema";

const PORT = 3000;

run();

async function run() {
  const app = express();
  const env = environment();

  configureGammaAuth(app, passport, env);
  configureGammaAuthRoutes(app, passport, env.redirectPath, env.clientHost);

  console.log(`GraphQL API is served on localhost:${PORT}${env.graphqlPath}`);
  configureGraphQLRoute(app, await schema(), env.graphqlPath);

  start(app);
}

function start(app: Application) {
  app.listen(PORT, () => console.log("Server is starting.."));
}
