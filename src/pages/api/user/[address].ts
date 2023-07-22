import { getAuth } from "@/auth/getAuth";
import { prisma } from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getAuth(req, res);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const rep = await prisma.users.findUnique({
    where: {
      address: req.query.address as string,
    },
  });
  if (!rep) {
    return res.status(404).json({ error: "Not found" });
  }
  return res.status(200).json({ ...rep });
}
