import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase();

export const isAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.AUTH_SECRET,
);

const providers = isAuthConfigured
  ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ]
  : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "dev-only-secret-change-me",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers,
  callbacks: {
    async signIn({ profile }) {
      if (!allowedDomain) {
        return true;
      }

      const email = profile?.email?.toLowerCase();
      return Boolean(email?.endsWith(`@${allowedDomain}`));
    },
    async jwt({ token, profile }) {
      if (profile?.sub) {
        token.id = profile.sub;
      }

      if (!token.role) {
        token.role = "member";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "demo-user";
        session.user.role = typeof token.role === "string" ? token.role : "member";
      }

      return session;
    },
  },
});
