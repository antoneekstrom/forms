import "reflect-metadata";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql";
import { requestAccessToken, requestAuthCode } from "./gamma-auth";
import axios from "axios";

const PORT = 3000;
const DEFAULT_GRAPHQL_PATH = "/api/gql";
const GRAPHQL_PATH =
  process.env.GRAPHQL_PATH ??
  (() => {
    console.log(`GRAPHQL_PATH not set, defaulting to ${DEFAULT_GRAPHQL_PATH}`);
    return "/api/gql";
  })();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_PATH, GAMMA_URL } =
  process.env as any;
const REDIRECT_URL = `http://localhost${REDIRECT_PATH}`;

const app = express();

(async () => {
  console.log(`GraphQL API is served on localhost:${PORT}${GRAPHQL_PATH}`);
  app.use(
    GRAPHQL_PATH,
    graphqlHTTP({
      schema: await schema(),
      graphiql: true,
    })
  );

  app.get("/api/auth/login", (req, res) =>
    res.redirect(requestAuthCode(CLIENT_ID, REDIRECT_URL, GAMMA_URL))
  );
  app.get(REDIRECT_PATH, async (req, res) => {
    const code = req.query.code;
    if (!code || typeof code !== "string") {
      return;
    }
    const r = await axios.post(requestAccessToken(CLIENT_ID, REDIRECT_URL, code, GAMMA_URL));
    console.log(r);
    res.send(r.data);
  });
})();

app.listen(PORT, () => console.log("Server is starting.."));
