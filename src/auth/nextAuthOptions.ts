import { prisma } from "@/db";
import { getAddrInfo } from "@/lib/getAddrInfo";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { z } from "zod";

const providers = [
  CredentialsProvider({
    name: "Ethereum",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0",
      },
    },
    async authorize(credentials, req) {
      console.log("test");
      console.log(
        "credentials",
        credentials,
        typeof credentials === "object",
        typeof credentials?.message === "object"
      );

      try {
        const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
        console.log("siwe ok", siwe);

        const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);

        console.log("next auth url", nextAuthUrl, process.env.NEXTAUTH_URL);
        console.log("cred");
        const result = await siwe
          .verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          })
          .catch((e) => {
            console.log("catch", e);
            throw new Error("Error verifying signature");
          });

        console.log("siwe", result, credentials, nextAuthUrl);

        if (result.success) {
          let user = await prisma.users.findUnique({
            where: {
              address: siwe.address,
            },
          });

          if (!user) {
            const { firstTxTimestamp, toAddr } = await getAddrInfo(
              siwe.address
            );

            console.log("getaddr ok");

            try {
              user = await prisma.users.create({
                data: {
                  address: siwe.address,
                  firstTxTimestamp: firstTxTimestamp,
                  toAddr: JSON.stringify(toAddr),
                },
              });
            } catch (e) {
              console.log(e);
              throw new Error("Error creating user");
            }
          }

          return {
            id: siwe.address,
            name: user?.username,
            image: user?.profile_pic_url,
          };
        }
        return null;
      } catch (e) {
        return null;
      }
    },
  }),
];

const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  image: z.string().optional(),
});

export const nextAuthOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Using the `...rest` parameter to be able to narrow down the type based on `trigger`
    async jwt({ token, trigger, session, user }) {
      if (trigger === "signIn") {
        token.username = user.name;
        token.image = user.image;
      }

      if (trigger === "update") {
        const { username, image } = updateProfileSchema.parse(session);

        const updatedUser = await prisma.users.update({
          where: {
            address: token.sub,
          },
          data: {
            username,
            profile_pic_url: image,
          },
        });
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.username = updatedUser.username;
        token.image = updatedUser.profile_pic_url;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.address = token.sub;

      session.user.username = token.username;
      session.user.image = token.image;
      return session;
    },
  },
};
