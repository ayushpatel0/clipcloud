import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		// Connect to MongoDB
		await connectToDatabase();

		// Fetch videos from MongoDB
		const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
		return NextResponse.json(videos || []);
	} catch (error) {
		return NextResponse.json(
			{
				error: "Failed to fetch videos",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body: IVideo = await request.json();
		if (
			!body.title ||
			!body.description ||
			!body.videoUrl ||
			!body.thumbnailUrl
		) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Connect to MongoDB
		await connectToDatabase();

		const videoData = {
			title: body.title,
			description: body.description,
			videoUrl: body.videoUrl,
			thumbnailUrl: body.thumbnailUrl,
			uploadedBy: session.user?.email || "anonymous",
			controls: body?.controls ?? true,
			transformation: {
				height: body.transformation?.height || 720,
				width: body.transformation?.width || 1280,
				quality: body.transformation?.quality ?? 80,
			},
		};

		// Create video in MongoDB
		const newVideo = await Video.create(videoData);
		return NextResponse.json(newVideo, { status: 201 });
	} catch {
		return NextResponse.json(
			{ error: "Failed to upload video. Please try again." },
			{ status: 500 }
		);
	}
}
