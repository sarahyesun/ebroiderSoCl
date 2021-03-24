const {
	sessionMiddleware,
	simpleRolesIsAuthorized
} = require('blitz');

module.exports = {
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
};
