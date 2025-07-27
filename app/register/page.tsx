"use client";
import { CheckCircle, Eye, EyeOff, Home, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			setIsLoading(false);
			return;
		}

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Registration failed");
			}

			setSuccess(true);
			setTimeout(() => {
				router.push("/login");
			}, 2000);
		} catch (error: unknown) {
			setError((error as Error)?.message || "Registration failed");
		}
		setIsLoading(false);
	};

	if (success) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<div className="card bg-white shadow-xl">
						<div className="card-body p-8 text-center">
							<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-slate-900 mb-2">
								Registration Successful!
							</h2>
							<p className="text-slate-600 mb-4">
								Your account has been created successfully. You will be
								redirected to the login page shortly.
							</p>
							<div className="loading loading-spinner loading-md text-primary"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

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
						Create Account
					</h1>
					<p className="text-slate-600">
						Join our community and start sharing your videos
					</p>
				</div>

				{/* Register Form */}
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
										Email Address
									</span>
								</label>
								<div className="relative">
									<input
										type="email"
										placeholder="Enter your email"
										className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
									<Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
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
										placeholder="Create a password"
										className="input input-bordered w-full pl-10 pr-10 focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
									<button
										type="button"
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</button>
								</div>
								<label className="label">
									<span className="label-text-alt text-slate-500">
										Must be at least 6 characters
									</span>
								</label>
							</div>

							{/* Confirm Password Field */}
							<div className="form-control">
								<label className="label">
									<span className="label-text font-medium text-slate-700">
										Confirm Password
									</span>
								</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										placeholder="Confirm your password"
										className="input input-bordered w-full pl-10 pr-10 focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
									<Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
									<button
										type="button"
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										{showConfirmPassword ? (
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
								{isLoading ? "Creating Account..." : "Create Account"}
							</button>
						</form>

						{/* Login Link */}
						<div className="divider text-slate-400">or</div>
						<div className="text-center">
							<p className="text-slate-600">
								Already have an account?{" "}
								<Link href="/login" className="link link-primary font-medium">
									Sign in here
								</Link>
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-6">
					<p className="text-sm text-slate-500">
						By creating an account, you agree to our{" "}
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

export default RegisterPage;
