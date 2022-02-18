export type EnvironmentVariables = {
  clientId: string;
  clientSecret: string;
  redirectPath: string;
  /**
   * Public url of the gamma backend.
   */
  gammaUrl: string;
  /**
   * Optional url to use instead of gammaUrl when making requests from the backend.
   */
  gammaLocalUrl?: string;
  graphqlPath: string;
  redirectUrl: string;
  /**
   * URL of the client application that is making use of the backend.
   */
  clientHost: string;
};

/**
 * @returns environment variables
 */
export function environment(): EnvironmentVariables {
  const {
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_REDIRECT,
    REDIRECT_PATH,
    GAMMA_URL,
    GRAPHQL_PATH,
    CLIENT_HOST,
    GAMMA_LOCAL_URL,
  } = process.env as Record<any, string>;
  return {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectPath: REDIRECT_PATH,
    gammaUrl: GAMMA_URL,
    graphqlPath: GRAPHQL_PATH,
    clientHost: CLIENT_HOST,
    gammaLocalUrl: GAMMA_LOCAL_URL,
    redirectUrl: CLIENT_REDIRECT,
  };
}
