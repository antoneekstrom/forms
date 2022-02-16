import Strategy from "./strategy";
import passport from "passport";
import { Authority, User } from "./types";

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
  clientID: string,
  clientSecret: string,
  callbackURL: string,
  gammaUrl: string,
  gammaLocalUrl: string
) => {
  const strategy = new Strategy(
    {
      authorizationURL: `${gammaUrl}${GAMMA_AUTH_PATH}`,
      tokenURL: `${gammaLocalUrl}${GAMMA_TOKEN_PATH}`,
      profileURL: `${gammaLocalUrl}${GAMMA_PROFILE_PATH}`,
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
