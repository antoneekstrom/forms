import passport from "passport";
import OAuth2Strategy from "passport-oauth2";

const GAMMA_STRATEGY = "gamma";
const GAMMA_URL = "https://gamma.chalmers.it";
const GAMMA_AUTH_PATH = "/api/oauth/authorize";
const GAMMA_TOKEN_PATH = "/api/oauth/token";

export function authenticateWithGamma(options?: passport.AuthenticateOptions) {
  return passport.authenticate(
    GAMMA_STRATEGY,
    options as passport.AuthenticateOptions
  );
}

export function authorizeWithGamma() {
  return passport.authorize(GAMMA_STRATEGY);
}

export function configureGammaStrategy(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  gammaUrl = GAMMA_URL
) {
  const verify: OAuth2Strategy.VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: unknown,
    verified: OAuth2Strategy.VerifyCallback
  ) => {
    console.log({ accessToken, refreshToken, profile, verified });
    const [err, user] = [undefined, undefined];
    return verified(err, user);
  };
  console.log({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri,
    GAMMA_AUTH_PATH: gammaUrl + GAMMA_AUTH_PATH,
    GAMMA_TOKEN_PATH: gammaUrl + GAMMA_TOKEN_PATH,
    verify: verify,
    GAMMA_STRATEGY: GAMMA_STRATEGY
  });
  configureOAuth2(
    clientId,
    clientSecret,
    redirectUri,
    gammaUrl + GAMMA_AUTH_PATH,
    gammaUrl + GAMMA_TOKEN_PATH,
    verify,
    GAMMA_STRATEGY
  );
}

/**
 *
 * @param clientId
 * @param clientSecret
 */
function configureOAuth2(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  authorizationUrl: string,
  tokenUrl: string,
  verify: OAuth2Strategy.VerifyFunction,
  strategy: string
) {
  passport.use(
    strategy,
    new OAuth2Strategy(
      {
        authorizationURL: authorizationUrl,
        tokenURL: tokenUrl,
        callbackURL: redirectUri,
        clientID: clientId,
        clientSecret,
      },
      verify
    )
  );
}
