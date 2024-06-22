export interface IAuthUser {
  id: string;
}

export interface IBeforeAuthUser extends IAuthUser {
  email: string;
}

export interface IJwtPayload {
  sub: string;
}

export interface IJwtUnVerifiedPayload {
  id: string;
  email: string;
}
