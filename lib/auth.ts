import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import { MockUserDB } from "./persistent-mock-db";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Missing email or password");
				}

				try {
					// Try MongoDB first, fallback to mock DB
					let useMockDB = false;
					try {
						await connectToDatabase();
					} catch {
						console.warn(
							"MongoDB connection failed, using mock database for development"
						);
						useMockDB = true;
					}

					if (useMockDB) {
						// Use mock database (plain text passwords for development)
						const user = await MockUserDB.findByEmailAndPassword(
							credentials.email,
							credentials.password
						);

						if (!user) {
							throw new Error("Invalid email or password");
						}

						return {
							id: user.email, // Use email as ID for mock DB
							email: user.email,
						};
					} else {
						// Use MongoDB with bcrypt
						const user = await User.findOne({ email: credentials.email });

						if (!user) {
							throw new Error("Invalid email or password");
						}

						const isValid = await bcrypt.compare(
							credentials.password,
							user.password
						);

						if (!isValid) {
							throw new Error("Invalid email or password");
						}

						return {
							id: user._id.toString(),
							email: user.email,
						};
					}
				} catch (error) {
					console.error("Auth error:", error);
					throw error;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
	},
	secret: process.env.NEXTAUTH_SECRET,
};
