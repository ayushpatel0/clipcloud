import { IVideo } from "@/models/Video";
import Link from "next/link";

export default function VideoComponent({ video }: { video: IVideo }) {
	return (
		<div className="card group">
			<div className="relative p-4">
				<Link href={`/videos/${video._id}`} className="block">
					<div
						className="rounded-lg overflow-hidden relative w-full bg-slate-100"
						style={{ aspectRatio: "16/9" }}
					>
						<video
							src={video.videoUrl}
							controls={video.controls}
							className="w-full h-full object-cover rounded-lg"
							preload="metadata"
						>
							Your browser does not support the video tag.
						</video>
						<div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
					</div>
				</Link>
			</div>

			<div className="card-body">
				<Link
					href={`/videos/${video._id}`}
					className="hover:opacity-70 transition-opacity"
				>
					<h3 className="card-title">{video.title}</h3>
				</Link>

				<p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
					{video.description}
				</p>
			</div>
		</div>
	);
}
