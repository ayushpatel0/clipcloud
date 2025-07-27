"use client";

import {
	ImageKitAbortError,
	ImageKitInvalidRequestError,
	ImageKitServerError,
	ImageKitUploadNetworkError,
	upload,
} from "@imagekit/next";
import { AlertCircle, CheckCircle, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
	onSuccess: (res: any) => void;
	onProgress?: (progress: number) => void;
	fileType?: "image" | "video";
	className?: string;
	placeholder?: string;
}

const FileUpload = ({
	onSuccess,
	onProgress,
	fileType = "image",
	className = "",
	placeholder,
}: FileUploadProps) => {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [progress, setProgress] = useState(0);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadComplete, setUploadComplete] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validateFile = (file: File) => {
		setError(null);

		if (fileType === "video") {
			if (!file.type.startsWith("video/")) {
				setError("Please upload a valid video file");
				return false;
			}
		} else if (fileType === "image") {
			if (!file.type.startsWith("image/")) {
				setError("Please upload a valid image file");
				return false;
			}
		}

		if (file.size > 100 * 1024 * 1024) {
			setError("File size must be less than 100 MB");
			return false;
		}

		return true;
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) return;

		if (!validateFile(file)) return;

		setSelectedFile(file);
		setUploading(true);
		setError(null);
		setProgress(0);
		setUploadComplete(false);

		try {
			const authRes = await fetch("/api/auth/imagekit-auth");
			const auth = await authRes.json();

			const res = await upload({
				file,
				fileName: file.name,
				publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
				signature: auth.signature,
				expire: auth.expire,
				token: auth.token,
				onProgress: (event) => {
					if (event.lengthComputable) {
						const percent = (event.loaded / event.total) * 100;
						setProgress(Math.round(percent));
						if (onProgress) {
							onProgress(Math.round(percent));
						}
					}
				},
			});

			setUploadComplete(true);
			onSuccess(res);
		} catch (error) {
			console.error("Upload failed", error);
			if (error instanceof ImageKitServerError) {
				setError("Server error occurred. Please try again.");
			} else if (error instanceof ImageKitInvalidRequestError) {
				setError("Invalid request. Please check your file.");
			} else if (error instanceof ImageKitUploadNetworkError) {
				setError("Network error. Please check your connection.");
			} else if (error instanceof ImageKitAbortError) {
				setError("Upload was cancelled.");
			} else {
				setError("Upload failed. Please try again.");
			}
		} finally {
			setUploading(false);
		}
	};

	const resetUpload = () => {
		setSelectedFile(null);
		setUploading(false);
		setError(null);
		setProgress(0);
		setUploadComplete(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className={`w-full ${className}`}>
			{/* Upload Area */}
			<div className="form-control">
				<div
					className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
            ${
							error
								? "border-error bg-error/5"
								: "border-base-300 hover:border-primary bg-base-50"
						}
            ${uploading ? "pointer-events-none opacity-70" : ""}
          `}
					onClick={() => fileInputRef.current?.click()}
				>
					<input
						ref={fileInputRef}
						type="file"
						accept={fileType === "video" ? "video/*" : "image/*"}
						onChange={handleFileChange}
						className="hidden"
						disabled={uploading}
					/>

					{uploadComplete ? (
						<div className="space-y-2">
							<CheckCircle className="w-12 h-12 text-success mx-auto" />
							<p className="text-success font-medium">Upload Complete!</p>
							<p className="text-sm text-base-content/70">
								{selectedFile?.name}
							</p>
							<button onClick={resetUpload} className="btn btn-outline btn-sm">
								Upload Another
							</button>
						</div>
					) : uploading ? (
						<div className="space-y-4">
							<Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
							<div className="space-y-2">
								<p className="text-primary font-medium">Uploading...</p>
								<p className="text-sm text-base-content/70">
									{selectedFile?.name}
								</p>
								<div className="w-full bg-base-200 rounded-full h-2">
									<div
										className="bg-primary h-2 rounded-full transition-all duration-300"
										style={{ width: `${progress}%` }}
									></div>
								</div>
								<p className="text-xs text-base-content/60">
									{progress}% uploaded
								</p>
							</div>
						</div>
					) : (
						<div className="space-y-2">
							<Upload className="w-12 h-12 text-base-content/50 mx-auto" />
							<p className="text-lg font-medium">
								{placeholder ||
									`Upload ${fileType === "video" ? "Video" : "Image"}`}
							</p>
							<p className="text-sm text-base-content/70">
								Click to browse or drag and drop your {fileType}
							</p>
							<p className="text-xs text-base-content/50">
								Max size: 100MB •{" "}
								{fileType === "video" ? "MP4, AVI, MOV" : "JPG, PNG, GIF"}
							</p>
						</div>
					)}
				</div>

				{/* Error Display */}
				{error && (
					<div className="alert alert-error mt-2">
						<AlertCircle className="w-4 h-4" />
						<span className="text-sm">{error}</span>
						<button
							onClick={() => setError(null)}
							className="btn btn-ghost btn-xs"
						>
							<X className="w-3 h-3" />
						</button>
					</div>
				)}

				{/* Selected File Info */}
				{selectedFile && !uploading && !uploadComplete && !error && (
					<div className="mt-2 p-2 bg-base-200 rounded-lg flex items-center justify-between">
						<span className="text-sm text-base-content/80">
							{selectedFile.name}
						</span>
						<button onClick={resetUpload} className="btn btn-ghost btn-xs">
							<X className="w-3 h-3" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default FileUpload;
