export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtDecodedBase {
  sub: string;
}

export type JwtDecodedResponse<TData> = JwtDecodedBase & {
  [key in keyof TData]: TData[key];
};
