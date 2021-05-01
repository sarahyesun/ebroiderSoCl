const mimeToExtension = (mime: string) => {
	switch (mime) {
		case 'image/png':
			return 'png';
		case 'image/svg+xml':
			return 'svg';
		case 'application/octet-stream':
			return 'exp';
		default:
			return '';
	}
};

export default mimeToExtension;
