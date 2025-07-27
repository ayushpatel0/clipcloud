"use client";

import { Users, Video, Zap } from "lucide-react";
import VideoUploadForm from "../components/VideoUploadForm";

export default function VideoUploadPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-6 py-12">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-5xl font-bold mb-6">
							Share Your{" "}
							<span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
								Creativity
							</span>
						</h1>
						<p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
							Upload your videos to ClipCloud and share them with our vibrant
							community. Let the world see your unique perspective and creative
							vision.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Upload Form */}
						<div className="lg:col-span-2">
							<VideoUploadForm />
						</div>

						{/* Tips and Guidelines */}
						<div className="space-y-6">
							{/* Upload Tips */}
							<div className="card bg-white shadow-lg border border-slate-200">
								<div className="card-body">
									<h3 className="card-title text-lg flex items-center gap-2">
										<Zap className="w-5 h-5 text-amber-500" />
										Upload Tips
									</h3>
									<ul className="space-y-3 text-sm text-slate-600">
										<li className="flex items-start gap-2">
											<span className="text-amber-500 mt-1">•</span>
											Keep videos under 100MB for faster uploads
										</li>
										<li className="flex items-start gap-2">
											<span className="text-amber-500 mt-1">•</span>
											Use descriptive titles and tags
										</li>
										<li className="flex items-start gap-2">
											<span className="text-amber-500 mt-1">•</span>
											Add engaging thumbnails
										</li>
										<li className="flex items-start gap-2">
											<span className="text-amber-500 mt-1">•</span>
											Supported formats: MP4, AVI, MOV
										</li>
										<li className="flex items-start gap-2">
											<span className="text-amber-500 mt-1">•</span>
											Recommended resolution: 1080p or higher
										</li>
									</ul>
								</div>
							</div>

							{/* Community Guidelines */}
							<div className="card bg-white shadow-lg border border-slate-200">
								<div className="card-body">
									<h3 className="card-title text-lg flex items-center gap-2">
										<Users className="w-5 h-5 text-blue-500" />
										Community Guidelines
									</h3>
									<ul className="space-y-3 text-sm text-slate-600">
										<li className="flex items-start gap-2">
											<span className="text-blue-500 mt-1">•</span>
											Be respectful and inclusive
										</li>
										<li className="flex items-start gap-2">
											<span className="text-blue-500 mt-1">•</span>
											No copyrighted content
										</li>
										<li className="flex items-start gap-2">
											<span className="text-blue-500 mt-1">•</span>
											Original content only
										</li>
										<li className="flex items-start gap-2">
											<span className="text-blue-500 mt-1">•</span>
											No spam or promotional content
										</li>
										<li className="flex items-start gap-2">
											<span className="text-blue-500 mt-1">•</span>
											Keep it family-friendly
										</li>
									</ul>
								</div>
							</div>

							{/* Statistics */}
							<div className="card bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg border border-slate-200">
								<div className="card-body">
									<h3 className="card-title text-lg flex items-center gap-2">
										<Video className="w-5 h-5 text-slate-700" />
										Platform Stats
									</h3>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-sm text-slate-600">
												Videos Uploaded
											</span>
											<span className="font-bold text-lg text-slate-900">
												12.4K+
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-slate-600">
												Active Creators
											</span>
											<span className="font-bold text-lg text-slate-900">
												1.2K+
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-slate-600">
												Total Views
											</span>
											<span className="font-bold text-lg text-slate-900">
												250K+
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Success Stories */}
					<div className="mt-16">
						<h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
							Join Our Community of Creators
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="card bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
								<div className="card-body text-center p-8">
									<div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
										<span className="text-3xl">🎬</span>
									</div>
									<h3 className="text-xl font-bold mb-3 text-slate-900">
										Creative Freedom
									</h3>
									<p className="text-slate-600 leading-relaxed">
										Express yourself without limits. Our platform supports all
										your creative endeavors and artistic vision.
									</p>
								</div>
							</div>

							<div className="card bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
								<div className="card-body text-center p-8">
									<div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
										<span className="text-3xl">🚀</span>
									</div>
									<h3 className="text-xl font-bold mb-3 text-slate-900">
										Reach New Audiences
									</h3>
									<p className="text-slate-600 leading-relaxed">
										Connect with viewers who appreciate your unique style and
										content from around the world.
									</p>
								</div>
							</div>

							<div className="card bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
								<div className="card-body text-center p-8">
									<div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
										<span className="text-3xl">💎</span>
									</div>
									<h3 className="text-xl font-bold mb-3 text-slate-900">
										High Quality
									</h3>
									<p className="text-slate-600 leading-relaxed">
										Your videos are delivered in the highest quality possible to
										all viewers across all devices.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
