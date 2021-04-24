import fs from 'fs';
import path from 'path';
import executeScript from './execute-python';
import {UPLOAD_DIR} from './config';
import {nanoid} from 'nanoid';
import db, {Design} from 'db';

const processImageUpload = async (design: Design, sourceOfTruthFileId: string) => {
	// Re-gen other files from source of truth
	const sourceOfTruth = await db.file.findUnique({where: {id: sourceOfTruthFileId}});

	if (!sourceOfTruth) {
		throw new Error('Could not find file.');
	}

	await Promise.all(['image/png', 'image/svg+xml', 'application/octet-stream'].map(async mimetype => {
		if (mimetype === sourceOfTruth.type) {
			return;
		}

		const id = nanoid();
		await executeScript(
			'generate_stitches',
			fs.createReadStream(path.join(UPLOAD_DIR, sourceOfTruthFileId)),
			fs.createWriteStream(path.join(UPLOAD_DIR, id)),
			sourceOfTruth.type,
			mimetype
		);

		await db.file.create({
			data: {
				id,
				type: mimetype,
				designId: design.id
			}
		});
	}));
};

export default processImageUpload;
