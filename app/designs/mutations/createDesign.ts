import {Ctx} from 'blitz';
import db from 'db';
import fs from 'fs';
import path from 'path';
import {UPLOAD_DIR} from 'utils/config';
import executeScript from 'utils/execute-python';

export default async function createDesign(
	{
		name,
		description,
		isPublic,
		designId
	}: { name: string; description: string; isPublic: boolean; designId: string },
	ctx: Ctx
) {
	ctx.session.$authorize();

	// Await executeScript('binarize', fs.createReadStream(path.join(UPLOAD_DIR, designId)), fs.createWriteStream(path.join(UPLOAD_DIR, 'out.png')));

	const design = await db.design.create({
		data: {
			name,
			description,
			isPublic,
			price: 0,
			user: {
				connect: {
					id: ctx.session.userId
				}
			}
		}
	});

	return design;
}
