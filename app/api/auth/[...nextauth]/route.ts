import NextAuth from "next-auth";
import { authOptions } from "@/auth"; // or "@/lib/auth" depending on where you put it

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
