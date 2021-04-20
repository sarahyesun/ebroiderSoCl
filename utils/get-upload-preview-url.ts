const getUploadPreviewUrl = (id: string, extension?: string) => {
	if (extension === 'svg') {
		const url = new URL(`/api/uploads/${id}.${extension}`, process.env.NEXT_PUBLIC_BASE_URL);
		url.searchParams.set('type', 'image/svg+xml');
		return url.toString();
	}

	const url = new URL(`/api/uploads/${id}`, process.env.NEXT_PUBLIC_BASE_URL);
	url.searchParams.set('type', 'image/jpeg');
	return url.toString();
};

export default getUploadPreviewUrl;
