import {Ctx} from 'blitz';
import db from 'db';
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
