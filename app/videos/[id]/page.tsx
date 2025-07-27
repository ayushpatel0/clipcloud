"use client";

import { IVideo } from "@/models/Video";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function VideoPage() {
	const params = useParams();
	const videoId = params.id as string;
	const [video, setVideo] = useState<IVideo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchVideo = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch all videos and find the specific one
			const response = await fetch("/api/video");
			if (!response.ok) {
				throw new Error("Failed to fetch videos");
			}

			const videos: IVideo[] = await response.json();
			const foundVideo = videos.find((v) => v._id?.toString() === videoId);

			if (!foundVideo) {
				throw new Error("Video not found");
			}

			setVideo(foundVideo);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	}, [videoId]);

	useEffect(() => {
		if (videoId) {
			fetchVideo();
		}
	}, [videoId, fetchVideo]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (error || !video) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Video Not Found
					</h1>
					<p className="text-gray-600 mb-6">
						{error || "The video you're looking for doesn't exist."}
					</p>
					<Link
						href="/"
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-6 py-8">
				{/* Back Button */}
				<div className="mb-6">
					<Link
						href="/"
						className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Home
					</Link>
				</div>

				{/* Video Player Section */}
				<div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
					<div className="aspect-video w-full bg-black">
						<video
							src={video.videoUrl}
							controls={video.controls !== false}
							className="w-full h-full object-contain"
							autoPlay={false}
							preload="metadata"
							poster={video.thumbnailUrl}
						>
							Your browser does not support the video tag.
						</video>
					</div>
				</div>

				{/* Video Information */}
				<div className="bg-white rounded-lg shadow-lg p-6">
					<div className="mb-6">
						<h1 className="text-3xl font-bold text-gray-900 mb-3">
							{video.title}
						</h1>

						<div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
							<div className="flex items-center">
								<User className="w-4 h-4 mr-2" />
								<span>Uploaded by {video.uploadedBy}</span>
							</div>
							<div className="flex items-center">
								<Calendar className="w-4 h-4 mr-2" />
								<span>
									{video.createdAt
										? new Date(video.createdAt).toLocaleDateString()
										: "Unknown date"}
								</span>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-3">
							Description
						</h2>
						<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
							{video.description}
						</p>
					</div>

					{/* Video Details */}
					<div className="border-t pt-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-3">
							Video Details
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<span className="font-medium text-gray-600">Video ID:</span>
								<span className="ml-2 text-gray-900 break-all">
									{video._id?.toString()}
								</span>
							</div>
							{video.transformation && (
								<>
									<div>
										<span className="font-medium text-gray-600">
											Resolution:
										</span>
										<span className="ml-2 text-gray-900">
											{video.transformation.width} x{" "}
											{video.transformation.height}
										</span>
									</div>
									<div>
										<span className="font-medium text-gray-600">Quality:</span>
										<span className="ml-2 text-gray-900">
											{video.transformation.quality}%
										</span>
									</div>
								</>
							)}
							<div>
								<span className="font-medium text-gray-600">Controls:</span>
								<span className="ml-2 text-gray-900">
									{video.controls !== false ? "Enabled" : "Disabled"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
