import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getOptions } from "./getNextAuthOptions";
import { NextApiRequest, NextApiResponse } from "next";

export function getAuth(req: NextApiRequest, res: NextApiResponse) {
  return getServerSession(req, res, getOptions(req) as any);
}
