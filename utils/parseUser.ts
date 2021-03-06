import { GetServerSidePropsContext } from "next";
import { verify } from "jsonwebtoken";
import { parse } from "cookie";
import { DiscordUser } from "./types";
import { config } from "./config";

export function parseUser(ctx: GetServerSidePropsContext): DiscordUser | null {
  if (!ctx.req.headers.cookie) {
    return null;
  }

  const token = parse(ctx.req.headers.cookie)[config.cookieName];

  if (!token) {
    return null;
  }

  try {
    const { iat, exp, ...user } = verify(
      token,
      config.jwtSecret
    ) as DiscordUser & { iat: number; exp: number };
    return user;
  } catch (e) {
    return null;
  }
}
