export interface User {
  cid: string;
  phone?: string;
  groups: string[];
  language: string;
  is_admin: boolean;
  accessToken?: string;
}

export interface GammaUser {
  cid: string;
  phone?: string;
  authorities: Authority[];
  groups: { superGroup: { name: string; type: string } }[];
  language: string;
}

export interface StrategyOptions {
  authorizationURL: string;
  tokenURL?: string;
  profileURL: string;
  clientID: string;
  clientSecret?: string;
  callbackURL: string;
}

export interface Authority {
  id: string;
  authority: string;
}

export interface TokenResponse {
  access_token: string;
}

export type VerifyFunction = (
  accessToken: string,
  user: GammaUser,
  verify: (err: Error | null, profile: Express.User, info: any) => void
) => void;
