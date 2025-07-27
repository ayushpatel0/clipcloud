"use client";
import { Eye, EyeOff, Home, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			setError("Invalid email or password");
			console.log(result.error);
		} else {
			router.push("/");
		}
		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<Link href="/" className="inline-flex items-center gap-2 mb-6">
						<div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-600 rounded-xl flex items-center justify-center">
							<Home className="w-5 h-5 text-white" />
						</div>
						<span className="text-2xl font-bold text-slate-900">ClipCloud</span>
					</Link>
					<h1 className="text-3xl font-bold text-slate-900 mb-2">
						Welcome Back
					</h1>
					<p className="text-slate-600">Sign in to your account to continue</p>
				</div>

				{/* Login Form */}
				<div className="card bg-white shadow-xl">
					<div className="card-body p-8">
						<form onSubmit={handleSubmit} className="space-y-6">
							{error && (
								<div className="alert alert-error">
									<span className="text-sm">{error}</span>
								</div>
							)}

							{/* Email Field */}
							<div className="form-control">
								<label className="label">
									<span className="label-text font-medium text-slate-700">
										Email
									</span>
								</label>
								<div className="relative">
									<input
										type="email"
										placeholder="Enter your email"
										className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
									<Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
								</div>
							</div>

							{/* Password Field */}
							<div className="form-control">
								<label className="label">
									<span className="label-text font-medium text-slate-700">
										Password
									</span>
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										className="input input-bordered w-full pl-10 pr-10 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
									<button
										type="button"
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10 transition-colors"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</button>
								</div>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								className={`btn btn-primary w-full ${
									isLoading ? "loading" : ""
								}`}
								disabled={isLoading}
							>
								{isLoading ? "Signing in..." : "Sign In"}
							</button>
						</form>

						{/* Register Link */}
						<div className="divider text-slate-400">or</div>
						<div className="text-center">
							<p className="text-slate-600">
								Don&apos;t have an account?{" "}
								<Link
									href="/register"
									className="link link-primary font-medium"
								>
									Create one here
								</Link>
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-6">
					<p className="text-sm text-slate-500">
						By continuing, you agree to our{" "}
						<a href="#" className="link link-primary">
							Terms of Service
						</a>{" "}
						and{" "}
						<a href="#" className="link link-primary">
							Privacy Policy
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
