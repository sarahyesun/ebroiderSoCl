const {
	sessionMiddleware,
	simpleRolesIsAuthorized
} = require('blitz');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
	middleware: [
		sessionMiddleware({
			isAuthorized: simpleRolesIsAuthorized
		})
	],
	// Webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
	// 	if (!isServer) {
	//     config.node = {
	//       fs: 'empty'
	//     }
	//   }

	//   return config
	// },
	images: {
		domains: ['source.unsplash.com', 'images.unsplash.com']
	}
});
