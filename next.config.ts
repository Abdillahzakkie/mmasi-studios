import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Emit a self-contained server bundle (.next/standalone + server.js) so the
	// Docker image can run `node server.js` without node_modules. Matches the
	// deployment pattern in the sibling managerenta project.
	output: "standalone",
	// styled-components needs the SWC transform for SSR class names to match
	// between server and client. This is the App Router equivalent of the babel
	// plugin the library's docs describe.
	compiler: {
		styledComponents: true,
	},
	reactStrictMode: true,
	poweredByHeader: false,
	productionBrowserSourceMaps: false,
	// Native / server-only deps must load from node_modules at runtime, not be
	// bundled into the route-handler bundles.
	serverExternalPackages: [
		"mongoose",
		"bcrypt",
		"@aws-sdk/client-s3",
		"@aws-sdk/s3-request-presigner",
		"imagekit",
	],
	images: {
		remotePatterns: [
			{ protocol: "http", hostname: "127.0.0.1", port: "9000", pathname: "/**" },
			{ protocol: "http", hostname: "localhost", port: "9000", pathname: "/**" },
		],
	},
};

export default nextConfig;
