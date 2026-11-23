import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
    accessToken?: string;
    sessionExpires?: number;
  }
  interface Session {
    user: { id: string; name: string; email: string; role: string };
    expires: string;
    sessionExpires?: number;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: string;
    accessToken?: string;
    sessionExpires?: number;
    error?: string;
  }
}
