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
	images: {
		domains: ['source.unsplash.com', 'images.unsplash.com', 'localhost']
	}
};
