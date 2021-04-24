import type {NextApiRequest, NextApiResponse} from 'next';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import {UPLOAD_DIR} from 'utils/config';
import prisma from 'db';

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

const handleDownloadRequest = async (request: NextApiRequest, response: NextApiResponse) => {
	// TODO: add auth

	const {query: {id}} = request;

	const design = await prisma.design.findUnique({
		where: {
			id: Number.parseInt(id as string, 10)
		},
		include: {
			files: true
		}
	});

	if (!design) {
		response.status(404).end();
		return;
	}

	response.setHeader('Content-Disposition', `attachment; filename=${design.name}.zip`);

	const archive = archiver('zip', {zlib: {level: 9}});

	for (const f of design.files) {
		archive.append(fs.createReadStream(path.join(UPLOAD_DIR, f.id)), {name: `${design.name}.${mimeToExtension(f.type)}`});
	}

	archive.pipe(response);
	await archive.finalize();
};

export default handleDownloadRequest;
