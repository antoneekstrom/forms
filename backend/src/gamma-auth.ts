import { URL } from "url";

const GAMMA_URL = "https://gamma.chalmers.it";
const GAMMA_AUTH_PATH = "/api/oauth/authorize";
const GAMMA_TOKEN_PATH = "/api/oauth/token";

export function requestAuthCode(
  clientId: string,
  redirect: string,
  gammaUrl = GAMMA_URL
) {
  const url = new URL(`${gammaUrl}${GAMMA_AUTH_PATH}`);
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("redirect_uri", redirect);
  url.searchParams.append("response_type", "code");
  return url.toString();
}

export function requestAccessToken(
  clientId: string,
  redirect: string,
  code: string,
  gammaUrl = GAMMA_URL
) {
  const url = new URL(`${gammaUrl}${GAMMA_TOKEN_PATH}`);
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("redirect_uri", redirect);
  url.searchParams.append("code", code);
  url.searchParams.append("grant_type", "authorization_code");
  return url.toString();
}
