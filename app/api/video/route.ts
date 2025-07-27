import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { MockVideoDB } from "@/lib/persistent-mock-db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		// Try to use MongoDB first, fallback to mock DB
		let useMockDB = false;
		try {
			await connectToDatabase();
		} catch (dbError) {
			useMockDB = true;
		}

		if (useMockDB) {
			// Use mock database and combine with demo videos
			const uploadedVideos = await MockVideoDB.find();

			// Demo videos for display
			const demoVideos = [
				{
					_id: "demo1",
					title: "Sample Video 1",
					description:
						"This is a demo video showcasing the video player functionality",
					videoUrl:
						"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
					thumbnailUrl:
						"https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
					uploadedBy: "demo-user",
					createdAt: new Date("2024-01-15"),
					controls: true,
					transformation: { height: 720, width: 1280, quality: 80 },
				},
				{
					_id: "demo2",
					title: "Nature Documentary",
					description: "Beautiful nature scenes from around the world",
					videoUrl:
						"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
					thumbnailUrl:
						"https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
					uploadedBy: "nature-lover",
					createdAt: new Date("2024-01-10"),
					controls: true,
					transformation: { height: 720, width: 1280, quality: 80 },
				},
				{
					_id: "demo3",
					title: "Tech Tutorial",
					description: "Learn modern web development techniques",
					videoUrl:
						"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
					thumbnailUrl:
						"https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
					uploadedBy: "tech-guru",
					createdAt: new Date("2024-01-05"),
					controls: true,
					transformation: { height: 720, width: 1280, quality: 80 },
				},
			];

			// Combine uploaded videos with demo videos, uploaded videos first
			const allVideos = [...uploadedVideos, ...demoVideos];
			return NextResponse.json(allVideos);
		} else {
			// Use MongoDB
			const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
			return NextResponse.json(videos || []);
		}
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

		// Try to use MongoDB, fallback to mock DB if connection fails
		let useMockDB = false;
		try {
			await connectToDatabase();
		} catch (dbError) {
			useMockDB = true;
		}

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

		if (useMockDB) {
			// Use mock database
			const newVideo = await MockVideoDB.create(videoData);

			return NextResponse.json(
				{
					...newVideo,
					message: "Video uploaded successfully (development mode)",
					note: "Connect MongoDB for production use",
				},
				{ status: 201 }
			);
		} else {
			// Use MongoDB
			const newVideo = await Video.create(videoData);
			return NextResponse.json(newVideo, { status: 201 });
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to upload video. Please try again." },
			{ status: 500 }
		);
	}
}
