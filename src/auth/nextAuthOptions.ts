import { prisma } from "@/db";
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
      try {
        const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
        const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);

        const result = await siwe.verify({
          signature: credentials?.signature || "",
          domain: nextAuthUrl.host,
          nonce: await getCsrfToken({ req }),
        });

        if (result.success) {
          let user = await prisma.users.findUnique({
            where: {
              address: siwe.address,
            },
          });

          if (!user) {
            user = await prisma.users.create({
              data: {
                address: siwe.address,
              },
            });
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
  image: z.string().url().optional(),
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
      console.log("user", user, trigger, token);

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
