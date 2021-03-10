import type {NextApiRequest, NextApiResponse} from 'next';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import {UPLOAD_DIR} from 'utils/config';
import prisma from 'db';
import {PassThrough} from 'stream';
import executeScript from 'utils/execute-python';

const handleDownloadRequest = async (request: NextApiRequest, response: NextApiResponse) => {
	// TODO: add auth

	const {query: {id}} = request;

	const design = await prisma.design.findUnique({where: {id: Number.parseInt(id as string, 10)}});

	if (!design) {
		response.status(404).end();
		return;
	}

	response.setHeader('Content-Disposition', `attachment; filename=${design.name}.zip`);

	const designPath = path.join(UPLOAD_DIR, `${design.stitchFileId}.svg`);

	const archive = archiver('zip', {zlib: {level: 9}});

	const pngPipe = new PassThrough();

	archive.append(pngPipe, {name: `${design.name}.png`});
	archive.append(fs.createReadStream(designPath), {name: `${design.name}.svg`});

	archive.pipe(response);

	await executeScript('generate_stitches', fs.createReadStream(designPath), pngPipe, 'svg', 'png');

	await archive.finalize();
};

export default handleDownloadRequest;
