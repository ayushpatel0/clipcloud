"use client";

import { Home, Upload, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useNotification } from "./Notification";

export default function Header() {
	const { data: session } = useSession();
	const { showNotification } = useNotification();

	const handleSignOut = async () => {
		try {
			await signOut();
			showNotification("Signed out successfully", "success");
		} catch {
			showNotification("Failed to sign out", "error");
		}
	};

	return (
		<div className="navbar">
			<div className="container mx-auto flex items-center justify-between">
				<div className="flex-1">
					<Link
						href="/"
						className="flex items-center gap-3 text-xl font-bold text-slate-900 hover:text-slate-700 transition-colors"
						onClick={() => showNotification("Welcome to ClipCloud", "info")}
					>
						<div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-600 rounded-lg flex items-center justify-center">
							<Home className="w-4 h-4 text-white" />
						</div>
						ClipCloud
					</Link>
				</div>
				<div className="flex items-center gap-6">
					{session && (
						<Link
							href="/upload"
							className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
						>
							<Upload className="w-4 h-4" />
							Upload
						</Link>
					)}
					<div className="relative group">
						<button className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200">
							<User className="w-4 h-4 text-slate-600" />
							{session && (
								<span className="hidden sm:block text-sm font-medium text-slate-700">
									{session.user?.email?.split("@")[0]}
								</span>
							)}
						</button>
						<div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
							{session ? (
								<div className="p-2">
									<div className="px-4 py-3 text-sm text-slate-500 border-b border-slate-100">
										Signed in as{" "}
										<span className="font-medium text-slate-700">
											{session.user?.email}
										</span>
									</div>
									<Link
										href="/upload"
										className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors my-1"
										onClick={() =>
											showNotification("Welcome to Upload", "info")
										}
									>
										<Upload className="w-4 h-4" />
										Upload Video
									</Link>
									<button
										onClick={handleSignOut}
										className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
									>
										<User className="w-4 h-4" />
										Sign Out
									</button>
								</div>
							) : (
								<div className="p-2">
									<Link
										href="/login"
										className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
										onClick={() =>
											showNotification("Please sign in to continue", "info")
										}
									>
										<User className="w-4 h-4" />
										Sign In
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
