import Strategy, { Authority } from "./strategy";
import passport from "passport";

export interface User {
  cid: string;
  phone?: string;
  is_admin: boolean;
  groups: string[];
  language: string;
  accessToken?: string;
}

const GAMMA_AUTH_PATH = "/api/oauth/authorize";
const GAMMA_TOKEN_PATH = "/api/oauth/token";
const GAMMA_PROFILE_PATH = "/api/users/me";

const isAdmin = (authorities: Authority[]): boolean => {
  if (process.env.MOCK == "true") {
    return true;
  }

  for (const i in authorities) {
    if (authorities[i].authority == process.env.ADMIN_AUTHORITY) {
      return true;
    }
  }

  return false;
};

export const init = (
  gammaUrl: string,
  clientID: string,
  clientSecret: string,
  callbackURL: string
) => {
  const strategy = new Strategy(
    {
      authorizationURL: `${gammaUrl}${GAMMA_AUTH_PATH}`,
      tokenURL: `http://gamma-backend:3000${GAMMA_TOKEN_PATH}`,
      profileURL: `http://gamma-backend:3000${GAMMA_PROFILE_PATH}`,
      clientID,
      clientSecret,
      callbackURL,
    },
    (accessToken, profile, cb: (_: any, __: User, ___: any) => void) => {
      cb(
        null,
        {
          cid: profile.cid,
          phone: profile.phone,
          is_admin: isAdmin(profile.authorities),
          groups: profile.groups
            .filter((g) => g.superGroup.type != "ALUMNI")
            .map((g) => g.superGroup.name),
          language: profile.language ?? "en",
          accessToken: accessToken,
        },
        null
      );
    }
  );
  passport.use(strategy);
  passport.deserializeUser(async (user: Express.User, cb) => {
    return cb(null, user);
  });
  passport.serializeUser(function (user: Express.User, cb) {
    cb(null, user);
  });
};
