// Mock database for development when MongoDB is not available
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

// In-memory storage (resets on server restart)
const mockUsers: MockUser[] = [];
const mockVideos: MockVideo[] = [];

export const MockUserDB = {
	async findOne(query: { email: string }): Promise<MockUser | null> {
		const user = mockUsers.find((user) => user.email === query.email);
		return user || null;
	},

	async create(userData: {
		email: string;
		password: string;
	}): Promise<MockUser> {
		const newUser: MockUser = {
			...userData,
			createdAt: new Date(),
		};
		mockUsers.push(newUser);
		return newUser;
	},

	async findByEmailAndPassword(
		email: string,
		password: string
	): Promise<MockUser | null> {
		const user = mockUsers.find(
			(user) => user.email === email && user.password === password
		);
		return user || null;
	},

	// Helper method to check if we should use mock DB
	shouldUseMockDB(): boolean {
		return (
			!process.env.MONGODB_URI ||
			process.env.MONGODB_URI.includes("localhost:27017") ||
			process.env.MONGODB_URI.includes("mock://")
		);
	},
};

export const MockVideoDB = {
	async find(): Promise<MockVideo[]> {
		return [...mockVideos].sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
		);
	},

	async create(
		videoData: Omit<MockVideo, "_id" | "createdAt">
	): Promise<MockVideo> {
		const newVideo: MockVideo = {
			...videoData,
			_id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			createdAt: new Date(),
		};
		mockVideos.push(newVideo);
		return newVideo;
	},

	async findById(id: string): Promise<MockVideo | null> {
		const video = mockVideos.find((video) => video._id === id);
		return video || null;
	},

	// Helper method to check if we should use mock DB
	shouldUseMockDB(): boolean {
		return (
			!process.env.MONGODB_URI ||
			process.env.MONGODB_URI.includes("localhost:27017") ||
			process.env.MONGODB_URI.includes("mock://")
		);
	},
};
