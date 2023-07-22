import { nextAuthOptions } from "@/auth/nextAuthOptions";
import NextAuth from "next-auth";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  return NextAuth(req, res, nextAuthOptions);
}
