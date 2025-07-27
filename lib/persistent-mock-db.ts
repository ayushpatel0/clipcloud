// Persistent mock database using JSON file storage
import { promises as fs } from "fs";
import path from "path";

interface MockUser {
	email: string;
	password: string;
	createdAt: Date;
}

interface MockVideo {
	_id: string;
	title: string;
	description: string;
	videoUrl: string;
	thumbnailUrl: string;
	uploadedBy: string;
	createdAt: Date;
	controls: boolean;
	transformation: {
		height: number;
		width: number;
		quality: number;
	};
}

// File paths for persistent storage
const USERS_FILE = path.join(process.cwd(), "data", "mock-users.json");
const VIDEOS_FILE = path.join(process.cwd(), "data", "mock-videos.json");

// Ensure data directory exists
async function ensureDataDir() {
	// Prevent file operations in production
	if (process.env.NODE_ENV === "production") {
		throw new Error("Mock database should not be used in production");
	}

	const dataDir = path.join(process.cwd(), "data");
	try {
		await fs.access(dataDir);
	} catch {
		await fs.mkdir(dataDir, { recursive: true });
	}
}

// Helper functions for file operations
async function loadUsers(): Promise<MockUser[]> {
	// Prevent file operations in production
	if (process.env.NODE_ENV === "production") {
		return [];
	}

	try {
		await ensureDataDir();
		const data = await fs.readFile(USERS_FILE, "utf-8");
		const users = JSON.parse(data);
		// Convert date strings back to Date objects
		return users.map((user: any) => ({
			...user,
			createdAt: new Date(user.createdAt),
		}));
	} catch {
		return [];
	}
}

async function saveUsers(users: MockUser[]): Promise<void> {
	// Prevent file operations in production
	if (process.env.NODE_ENV === "production") {
		return;
	}

	await ensureDataDir();
	await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function loadVideos(): Promise<MockVideo[]> {
	// Prevent file operations in production
	if (process.env.NODE_ENV === "production") {
		return [];
	}

	try {
		await ensureDataDir();
		const data = await fs.readFile(VIDEOS_FILE, "utf-8");
		const videos = JSON.parse(data);
		// Convert date strings back to Date objects
		return videos.map((video: any) => ({
			...video,
			createdAt: new Date(video.createdAt),
		}));
	} catch {
		return [];
	}
}

async function saveVideos(videos: MockVideo[]): Promise<void> {
	// Prevent file operations in production
	if (process.env.NODE_ENV === "production") {
		return;
	}

	await ensureDataDir();
	await fs.writeFile(VIDEOS_FILE, JSON.stringify(videos, null, 2));
}

export const MockUserDB = {
	async findOne(query: { email: string }): Promise<MockUser | null> {
		const users = await loadUsers();
		const user = users.find((user) => user.email === query.email);
		return user || null;
	},

	async create(userData: {
		email: string;
		password: string;
	}): Promise<MockUser> {
		const users = await loadUsers();
		const newUser: MockUser = {
			...userData,
			createdAt: new Date(),
		};
		users.push(newUser);
		await saveUsers(users);
		return newUser;
	},

	async findByEmailAndPassword(
		email: string,
		password: string
	): Promise<MockUser | null> {
		const users = await loadUsers();
		const user = users.find(
			(user) => user.email === email && user.password === password
		);
		return user || null;
	},

	// Helper method to check if we should use mock DB
	shouldUseMockDB(): boolean {
		// Never use mock DB in production
		if (process.env.NODE_ENV === "production") {
			return false;
		}

		return (
			!process.env.MONGODB_URI ||
			process.env.MONGODB_URI.includes("localhost:27017") ||
			process.env.MONGODB_URI.includes("mock://")
		);
	},
};

export const MockVideoDB = {
	async find(): Promise<MockVideo[]> {
		const videos = await loadVideos();
		return videos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
	},

	async create(
		videoData: Omit<MockVideo, "_id" | "createdAt">
	): Promise<MockVideo> {
		const videos = await loadVideos();
		const newVideo: MockVideo = {
			...videoData,
			_id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			createdAt: new Date(),
		};
		videos.push(newVideo);
		await saveVideos(videos);
		return newVideo;
	},

	async findById(id: string): Promise<MockVideo | null> {
		const videos = await loadVideos();
		const video = videos.find((video) => video._id === id);
		return video || null;
	},

	// Helper method to check if we should use mock DB
	shouldUseMockDB(): boolean {
		// Never use mock DB in production
		if (process.env.NODE_ENV === "production") {
			return false;
		}

		return (
			!process.env.MONGODB_URI ||
			process.env.MONGODB_URI.includes("localhost:27017") ||
			process.env.MONGODB_URI.includes("mock://")
		);
	},
};
