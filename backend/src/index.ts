import "reflect-metadata";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql";

const app = express();

(async () => app.use(
  "/graphql",
  graphqlHTTP({
    schema: await schema(),
    graphiql: true,
  })
))()

app.listen(3000, () => console.log("Server is starting.."));
