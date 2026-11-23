import $SERVICE_REPOSITORY from "@/services/service.repo";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/** The API session lasts 30 minutes (absolute). The cookie never outlives it. */
const SESSION_SECONDS = 30 * 60;

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      // Step 1 (password -> OTP e-mail) is a server action. This provider only runs step 2:
      // the OTP is exchanged for the API session token, which then lives ONLY in the encrypted httpOnly cookie.
      credentials: {
        challengeId: { label: "Challenge", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      authorize: async (credentials) => {
        const res = await $SERVICE_REPOSITORY.Auth.verifyOtp({
          challengeId: credentials?.challengeId ?? "",
          otp: credentials?.otp ?? "",
        });
        // throwing is how the API's message reaches the form (`signIn(..., { redirect: false })` returns it as `error`)
        if (!res.ok) throw new Error(res.error.issues?.[0] ?? res.error.message);

        const { access_token, expiresAt, user } = res.data.data;
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken: access_token,
          sessionExpires: new Date(expiresAt).getTime(),
        };
      },
    }),
  ],

  pages: { signIn: "/signin", error: "/signin" },

  session: { strategy: "jwt", maxAge: SESSION_SECONDS },
  jwt: { maxAge: SESSION_SECONDS },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        return { ...token, userId: user.id, role: user.role, accessToken: user.accessToken, sessionExpires: user.sessionExpires, error: undefined };
      }
      // absolute expiry: reading the session never extends it
      if (token.sessionExpires && Date.now() > token.sessionExpires) {
        return { ...token, accessToken: undefined, error: "SessionExpired" };
      }
      return token;
    },

    // readable in the browser: the API token is never put here
    async session({ session, token }) {
      session.user = {
        id: token.userId ?? token.sub ?? "",
        name: (token.name as string) ?? "",
        email: (token.email as string) ?? "",
        role: token.role ?? "employee",
      };
      session.sessionExpires = token.sessionExpires;
      session.error = token.error;
      return session;
    },
  },
};
