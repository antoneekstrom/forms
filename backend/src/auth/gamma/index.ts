import axios from "axios";
import { Response } from "express";

const GAMMA_AUTH_PATH = "/api/oauth/authorize";
const GAMMA_TOKEN_PATH = "/api/oauth/token";
const GAMMA_PROFILE_PATH = "/api/users/me";

type Options = {
  clientId: string;
  clientSecret: string;
  clientHost: string;
  redirectPath: string;
  redirectUrl: string;
  gammaUrl: string;
  gammaLocalUrl: string;
};

type GammaUser = {
  cid: string;
  groups: { superGroup: { name: string; type: string } }[];
  language?: "en" | "sv";
};

function authorizationHeader({ clientId, clientSecret }: Options) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  )}`;
}

function tokenBearerHeader(accessToken: string) {
  return `Bearer ${accessToken}`;
}

function profileUrl({ gammaLocalUrl }: Options) {
  return gammaLocalUrl + GAMMA_PROFILE_PATH;
}

function authorizationUrl({ gammaUrl, clientId, redirectUrl }: Options) {
  const url = new URL(gammaUrl + GAMMA_AUTH_PATH);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("redirect_uri", redirectUrl);
  return url.toString();
}

function tokenUrl(code: string, { gammaLocalUrl, redirectUrl }: Options) {
  const url = new URL(gammaLocalUrl + GAMMA_TOKEN_PATH);
  url.searchParams.set("grant_type", "authorization_code");
  url.searchParams.set("redirect_uri", redirectUrl);
  url.searchParams.set("code", code);
  return url.toString();
}

function redirectToGammaLogin(res: Response, options: Options) {
  const url = authorizationUrl(options);
  res.redirect(url);
}

async function getAccessToken(code: string, options: Options) {
  const url = tokenUrl(code, options);
  const { data } = await axios.post(url, null, {
    headers: {
      Authorization: authorizationHeader(options),
    },
  });
  return data.access_token;
}

async function getUserFromGamma(
  accessToken: string,
  options: Options
): Promise<GammaUser | undefined> {
  const response = await axios.get<GammaUser>(profileUrl(options), {
    headers: {
      Authorization: tokenBearerHeader(accessToken),
    },
  });
  return {
    language: "en",
    ...response.data,
  };
}

export {
  GammaUser,
  Options,
  redirectToGammaLogin,
  getAccessToken,
  getUserFromGamma,
};
