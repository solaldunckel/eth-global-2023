import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { nextAuthOptions } from "./nextAuthOptions";

export function getAuth(req: NextApiRequest, res: NextApiResponse) {
  return getServerSession(req, res, nextAuthOptions);
}
