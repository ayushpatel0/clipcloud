"use client";

import { IVideo } from "@/models/Video";
import { Play, Upload, Users, Video as VideoIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";

export default function Home() {
	const { data: session } = useSession();
	const [videos, setVideos] = useState<IVideo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchVideos();
	}, []);

	const fetchVideos = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetch("/api/video");

			if (!response.ok) {
				if (response.status === 500) {
					throw new Error("Server error - please check database connection");
				}
				throw new Error(`Failed to fetch videos: ${response.status}`);
			}

			const contentType = response.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) {
				throw new Error("Server returned invalid response format");
			}

			const data = await response.json();
			setVideos(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			setVideos([]); // Set empty array as fallback
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-6 py-12">
			{/* Hero Section */}
			<div className="hero mb-16">
				<div className="hero-content">
					<div>
						<h1 className="text-6xl font-bold tracking-tight mb-6">
							Welcome to{" "}
							<span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
								ClipCloud
							</span>
						</h1>
						<p className="text-xl text-slate-600 mb-8 leading-relaxed">
							Discover, upload, and share amazing videos with the world.{" "}
							<br className="hidden sm:block" />
							Your creative journey starts here.
						</p>
						<div className="flex gap-4 justify-center flex-wrap">
							{session ? (
								<Link href="/upload" className="btn btn-primary btn-lg">
									<Upload className="w-5 h-5" />
									Upload Video
								</Link>
							) : (
								<Link href="/login" className="btn btn-primary btn-lg">
									<Play className="w-5 h-5" />
									Get Started
								</Link>
							)}
							<a href="#videos" className="btn btn-outline btn-lg">
								<VideoIcon className="w-5 h-5" />
								Browse Videos
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Section */}
			<div className="stats shadow w-full mb-12">
				<div className="stat">
					<div className="flex items-center justify-center mb-2">
						<VideoIcon className="w-8 h-8 text-blue-600" />
					</div>
					<div className="stat-title">Total Videos</div>
					<div className="stat-value text-blue-600">{videos.length}</div>
					<div className="stat-desc">Videos uploaded by creators</div>
				</div>

				<div className="stat">
					<div className="flex items-center justify-center mb-2">
						<Users className="w-8 h-8 text-purple-600" />
					</div>
					<div className="stat-title">Active Users</div>
					<div className="stat-value text-purple-600">1.2K</div>
					<div className="stat-desc">↗︎ Growing community</div>
				</div>

				<div className="stat">
					<div className="flex items-center justify-center mb-2">
						<Play className="w-8 h-8 text-green-600" />
					</div>
					<div className="stat-title">Total Views</div>
					<div className="stat-value text-green-600">12.4K</div>
					<div className="stat-desc">↗︎ 400 (22%)</div>
				</div>
			</div>

			{/* Quick Actions */}
			{session && (
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<Link
							href="/upload"
							className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
						>
							<div className="card-body items-center text-center">
								<Upload className="w-12 h-12 text-primary mb-2" />
								<h3 className="card-title">Upload Video</h3>
								<p>Share your creativity with the world</p>
							</div>
						</Link>

						<div className="card bg-base-200">
							<div className="card-body items-center text-center">
								<VideoIcon className="w-12 h-12 text-secondary mb-2" />
								<h3 className="card-title">My Videos</h3>
								<p>Manage your uploaded content</p>
							</div>
						</div>

						<div className="card bg-base-200">
							<div className="card-body items-center text-center">
								<Users className="w-12 h-12 text-accent mb-2" />
								<h3 className="card-title">Community</h3>
								<p>Connect with other creators</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Video Feed Section - Only show if there are videos */}
			{videos.length > 0 && (
				<div id="videos" className="mb-8">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-3xl font-bold">Latest Videos</h2>
						{session && (
							<Link href="/upload" className="btn btn-primary">
								<Upload className="w-4 h-4" />
								Upload New
							</Link>
						)}
					</div>

					{loading ? (
						<div className="flex justify-center items-center py-12">
							<span className="loading loading-spinner loading-lg"></span>
						</div>
					) : error ? (
						<div className="alert alert-error">
							<span>Error loading videos: {error}</span>
						</div>
					) : (
						<VideoFeed videos={videos} />
					)}
				</div>
			)}

			{/* Call to Action */}
			{!session && (
				<div className="card bg-gradient-to-r from-primary/10 to-secondary/10 mb-8">
					<div className="card-body text-center">
						<h2 className="card-title justify-center text-2xl mb-4">
							Ready to Join ClipCloud?
						</h2>
						<p className="text-lg mb-6">
							Create an account to upload your videos and connect with our
							amazing community.
						</p>
						<div className="flex gap-4 justify-center flex-wrap">
							<Link href="/register" className="btn btn-primary btn-lg">
								Sign Up Now
							</Link>
							<Link href="/login" className="btn btn-outline btn-lg">
								Login
							</Link>
						</div>
					</div>
				</div>
			)}

			{/* Features Section */}
			<div className="mb-12">
				<h2 className="text-3xl font-bold text-center mb-8">
					Why Choose ClipCloud?
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="text-center">
						<div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<Upload className="w-8 h-8 text-primary" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
						<p className="text-base-content/70">
							Upload your videos with just a few clicks. Our platform supports
							various formats and provides automatic optimization.
						</p>
					</div>

					<div className="text-center">
						<div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<Play className="w-8 h-8 text-secondary" />
						</div>
						<h3 className="text-xl font-semibold mb-2">High Quality</h3>
						<p className="text-base-content/70">
							Enjoy high-quality video streaming with adaptive bitrate and
							multiple resolution options for the best viewing experience.
						</p>
					</div>

					<div className="text-center">
						<div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<Users className="w-8 h-8 text-accent" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Community</h3>
						<p className="text-base-content/70">
							Join a vibrant community of creators and viewers. Discover new
							content and connect with like-minded people.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
