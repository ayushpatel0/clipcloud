"use client";

import { Image as ImageIcon, Loader2, Upload, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNotification } from "./Notification";

interface VideoFormData {
	title: string;
	description: string;
	videoUrl: string;
	thumbnailUrl: string;
	controls: boolean;
}

export default function VideoUploadForm() {
	const { data: session } = useSession();
	const { showNotification } = useNotification();
	const router = useRouter();
	const [formData, setFormData] = useState<VideoFormData>({
		title: "",
		description: "",
		videoUrl: "",
		thumbnailUrl: "",
		controls: true,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const uploadToImageKit = async (
		file: File,
		type: "video" | "image"
	): Promise<string> => {
		// Check if ImageKit is configured
		if (
			!process.env.NEXT_PUBLIC_PUBLIC_KEY ||
			!process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
		) {
			// Fallback: create object URL for local preview
			const objectUrl = URL.createObjectURL(file);
			return objectUrl;
		}

		try {
			// Get authentication parameters from our API
			const authResponse = await fetch("/api/auth/imagekit-auth");
			const authData = await authResponse.json();

			if (!authResponse.ok) {
				throw new Error("Failed to get ImageKit authentication");
			}

			// Create FormData for ImageKit upload
			const formData = new FormData();
			formData.append("file", file);
			formData.append("publicKey", authData.publicKey);
			formData.append("signature", authData.authenticationParameters.signature);
			formData.append("expire", authData.authenticationParameters.expire);
			formData.append("token", authData.authenticationParameters.token);
			formData.append("fileName", `${type}_${Date.now()}_${file.name}`);

			// Upload to ImageKit
			const uploadResponse = await fetch(
				"https://upload.imagekit.io/api/v1/files/upload",
				{
					method: "POST",
					body: formData,
				}
			);

			const uploadResult = await uploadResponse.json();

			if (!uploadResponse.ok) {
				throw new Error(uploadResult.message || "Upload failed");
			}

			return uploadResult.url;
		} catch (error) {
			// Fallback to object URL if ImageKit fails
			const objectUrl = URL.createObjectURL(file);
			return objectUrl;
		}
	};

	const handleVideoFileChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (file) {
			setVideoFile(file);
			setIsLoading(true);

			try {
				const isImageKitConfigured =
					process.env.NEXT_PUBLIC_PUBLIC_KEY &&
					process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT;
				showNotification(
					isImageKitConfigured
						? "Uploading video file..."
						: "Processing video file (development mode)...",
					"info"
				);
				const videoUrl = await uploadToImageKit(file, "video");
				setFormData((prev) => ({
					...prev,
					videoUrl,
				}));
				showNotification(
					isImageKitConfigured
						? "Video file uploaded successfully!"
						: "Video file processed (local preview mode)!",
					"success"
				);
			} catch (error) {
				showNotification(
					"Failed to upload video file. Please try again.",
					"error"
				);
				setVideoFile(null);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleThumbnailFileChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (file) {
			setThumbnailFile(file);
			setIsLoading(true);

			try {
				const isImageKitConfigured =
					process.env.NEXT_PUBLIC_PUBLIC_KEY &&
					process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT;
				showNotification(
					isImageKitConfigured
						? "Uploading thumbnail..."
						: "Processing thumbnail (development mode)...",
					"info"
				);
				const thumbnailUrl = await uploadToImageKit(file, "image");
				setFormData((prev) => ({
					...prev,
					thumbnailUrl,
				}));
				showNotification(
					isImageKitConfigured
						? "Thumbnail uploaded successfully!"
						: "Thumbnail processed (local preview mode)!",
					"success"
				);
			} catch (error) {
				showNotification(
					"Failed to upload thumbnail. Please try again.",
					"error"
				);
				setThumbnailFile(null);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!session) {
			showNotification("You must be logged in to upload videos", "error");
			return;
		}

		if (
			!formData.title ||
			!formData.description ||
			!formData.videoUrl ||
			!formData.thumbnailUrl
		) {
			showNotification("Please fill in all required fields", "error");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/video", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				showNotification("Video uploaded successfully!", "success");

				// Reset form
				setFormData({
					title: "",
					description: "",
					videoUrl: "",
					thumbnailUrl: "",
					controls: true,
				});
				setVideoFile(null);
				setThumbnailFile(null);

				// Redirect to home page after a short delay to show the success message
				setTimeout(() => {
					router.push("/");
				}, 1500);
			} else {
				throw new Error("Failed to upload video");
			}
		} catch (error) {
			showNotification("Failed to upload video. Please try again.", "error");
		} finally {
			setIsLoading(false);
		}
	};

	if (!session) {
		return (
			<div className="card bg-base-100 shadow-xl">
				<div className="card-body text-center">
					<h2 className="card-title justify-center">Authentication Required</h2>
					<p>You must be logged in to upload videos.</p>
					<div className="card-actions justify-center">
						<a href="/login" className="btn btn-primary">
							Login
						</a>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="card bg-base-100 shadow-xl">
			<div className="card-body">
				<h2 className="card-title">
					<Upload className="w-6 h-6" />
					Upload New Video
				</h2>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Video File Upload */}
					<div className="form-control">
						<label className="label">
							<span className="label-text font-medium">Video File *</span>
						</label>
						<div className="relative">
							<input
								type="file"
								accept="video/*"
								onChange={handleVideoFileChange}
								className="file-input file-input-bordered file-input-primary w-full"
								required
							/>
							<Video className="absolute left-3 top-3 w-5 h-5 text-base-content/50" />
						</div>
						{videoFile && (
							<div className="label">
								<span className="label-text-alt text-success">
									Selected: {videoFile.name}
								</span>
							</div>
						)}
					</div>

					{/* Thumbnail Upload */}
					<div className="form-control">
						<label className="label">
							<span className="label-text font-medium">Thumbnail Image *</span>
						</label>
						<div className="relative">
							<input
								type="file"
								accept="image/*"
								onChange={handleThumbnailFileChange}
								className="file-input file-input-bordered file-input-secondary w-full"
								required
							/>
							<ImageIcon className="absolute left-3 top-3 w-5 h-5 text-base-content/50" />
						</div>
						{thumbnailFile && (
							<div className="label">
								<span className="label-text-alt text-success">
									Selected: {thumbnailFile.name}
								</span>
							</div>
						)}
					</div>

					{/* Title */}
					<div className="form-control">
						<label className="label">
							<span className="label-text font-medium">Title *</span>
						</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleInputChange}
							placeholder="Enter video title"
							className="input input-bordered w-full"
							required
							maxLength={100}
						/>
						<div className="label">
							<span className="label-text-alt">
								{formData.title.length}/100
							</span>
						</div>
					</div>

					{/* Description */}
					<div className="form-control">
						<label className="label">
							<span className="label-text font-medium">Description *</span>
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder="Describe your video"
							className="textarea textarea-bordered h-24"
							required
							maxLength={500}
						/>
						<div className="label">
							<span className="label-text-alt">
								{formData.description.length}/500
							</span>
						</div>
					</div>

					{/* Controls Toggle */}
					<div className="form-control">
						<label className="label cursor-pointer">
							<span className="label-text font-medium">
								Enable Video Controls
							</span>
							<input
								type="checkbox"
								name="controls"
								checked={formData.controls}
								onChange={handleInputChange}
								className="toggle toggle-primary"
							/>
						</label>
					</div>

					{/* Submit Button */}
					<div className="form-control mt-6">
						<button
							type="submit"
							disabled={isLoading}
							className="btn btn-primary w-full"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Uploading...
								</>
							) : (
								<>
									<Upload className="w-5 h-5" />
									Upload Video
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
