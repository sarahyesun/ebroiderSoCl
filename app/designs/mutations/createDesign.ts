import {Ctx} from 'blitz';
import db from 'db';
import fs from 'fs';
import path from 'path';
import {PassThrough} from 'stream';
import {UPLOAD_DIR} from 'utils/config';
import executeScript from 'utils/execute-python';
import processImageUpload from 'utils/process-image-upload';

export default async function createDesign(
	{
		name,
		description,
		isPublic,
		stitchFileId
	}: { name: string; description: string; isPublic: boolean; stitchFileId: string },
	ctx: Ctx
) {
	ctx.session.$authorize();

	await processImageUpload(stitchFileId);

	const design = await db.design.create({
		data: {
			name,
			description,
			isPublic,
			price: 0,
			stitchFileId,
			user: {
				connect: {
					id: ctx.session.userId
				}
			}
		}
	});

	return design;
}
