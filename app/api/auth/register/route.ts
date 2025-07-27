import { connectToDatabase } from "@/lib/db";
import { MockUserDB } from "@/lib/persistent-mock-db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Please enter a valid email address" },
				{ status: 400 }
			);
		}

		// Validate password length
		if (password.length < 6) {
			return NextResponse.json(
				{ error: "Password must be at least 6 characters long" },
				{ status: 400 }
			);
		}

		// Try to use MongoDB, fallback to mock DB if connection fails
		let useMockDB = false;
		try {
			await connectToDatabase();
		} catch {
			useMockDB = true;
		}

		if (useMockDB) {
			// Use mock database
			const existingUser = await MockUserDB.findOne({ email });
			if (existingUser) {
				return NextResponse.json(
					{ error: "User already registered with this email" },
					{ status: 409 }
				);
			}

			await MockUserDB.create({ email, password });

			return NextResponse.json(
				{
					message: "User registered successfully (using development mode)",
					note: "Connect MongoDB for production use",
				},
				{ status: 201 }
			);
		} else {
			// Use MongoDB
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return NextResponse.json(
					{ error: "User already registered with this email" },
					{ status: 409 }
				);
			}

			await User.create({ email, password });

			return NextResponse.json(
				{ message: "User registered successfully" },
				{ status: 201 }
			);
		}
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json(
			{ error: "Failed to register user. Please try again." },
			{ status: 500 }
		);
	}
}
