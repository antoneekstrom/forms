import "reflect-metadata";
import express from "express";
import { Application } from "express-serve-static-core";
import { environment } from "./env";
import { schema } from "./graphql/schema";
import { GraphQLSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import { configureGammaAuth } from "@ekstrom/gamma-auth";

const PORT = 3000;

run();

async function run() {
  const app = express();
  const env = environment();

  configureGammaAuth(app, env);
  configureGraphQLRoute(app, await schema(), env.graphqlPath);

  start(app);
}

function start(app: Application) {
  app.listen(PORT, () => console.log("Server is starting.."));
}

function configureGraphQLRoute(
  app: Application,
  schema: GraphQLSchema,
  route: string
) {
  app.use(
    route,
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    })
  );
}
