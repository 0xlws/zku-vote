import { NextApiResponse, NextApiRequest } from "next";
import { serialize } from "cookie";
import { config } from "../../utils/config";

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    serialize(config.cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      path: "/",
    })
  );

  res.redirect("/");
}
