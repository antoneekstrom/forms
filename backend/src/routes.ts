import { Application, Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema } from "graphql";
import { PassportStatic } from "passport";
import { User } from "./auth/types";

export function configureGraphQLRoute(
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

export function configureGammaAuthRoutes(
  app: Application,
  passport: PassportStatic,
  redirectPath: string,
  clientHost: string
) {
  app.get("/api/auth/login", passport.authenticate("gamma"));
  app.get(
    redirectPath,
    passport.authenticate("gamma"),
    (req: Request, res: Response) => {
      const user = createUser(req);
      delete user.accessToken;

      redirectToClient(res, clientHost);
    }
  );
  app.get("/api/auth/logout", (req: Request, res: Response) => {
    req.logOut();
    redirectToClient(res, clientHost);
  });
}

function createUser(req: Request): User {
  return {
    cid: "",
    is_admin: false,
    groups: [],
    language: "en",
    ...req.user,
  };
}

function redirectToClient(res: Response, clientHost: string) {
  res.status(200);
  res.redirect(clientHost);
}
