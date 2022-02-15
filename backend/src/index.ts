import "reflect-metadata";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql";
import cors from "cors";
import { init, User } from "./auth/gamma.strategy";
import passport from "passport";
import session, { MemoryStore } from "express-session";

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

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

init(GAMMA_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

app.use(
  session({
    secret: CLIENT_SECRET,
    cookie: { maxAge: 86400000 },
    store: new MemoryStore(),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

(async () => {
  console.log(`GraphQL API is served on localhost:${PORT}${GRAPHQL_PATH}`);
  app.use(
    GRAPHQL_PATH,
    graphqlHTTP({
      schema: await schema(),
      graphiql: true,
    })
  );
  app.get("/api/auth/login", passport.authenticate("gamma"));
  app.get(
    REDIRECT_PATH,
    passport.authenticate("gamma"),
    (req: express.Request, res: express.Response) => {
      const user: User = {
        cid: "",
        is_admin: false,
        groups: [],
        language: "en",
        ...req.user,
      };
      delete user.accessToken;

      res.status(200);
      res.redirect("http://localhost:3000");
    }
  );
  app.get("/api/auth/logout", (req: express.Request, res: express.Response) => {
    req.logOut();
    
    res.status(200);
    res.redirect("http://localhost:3000");
  });
})();

app.listen(PORT, () => console.log("Server is starting.."));
