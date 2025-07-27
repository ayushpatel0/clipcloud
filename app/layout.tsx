import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import { NotificationProvider } from "./components/Notification";
import Providers from "./components/Providers";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ClipCloud - Video Sharing Platform",
	description: "Upload, share, and discover amazing videos on ClipCloud",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<NotificationProvider>
						<Header />
						<main className="min-h-screen">{children}</main>
					</NotificationProvider>
				</Providers>
			</body>
		</html>
	);
}
