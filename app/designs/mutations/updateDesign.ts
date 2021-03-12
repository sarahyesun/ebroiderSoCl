import {Ctx} from 'blitz';
import db, {Prisma} from 'db';
import processImageUpload from 'utils/process-image-upload';

type UpdateDesignInput = Pick<Prisma.DesignUpdateArgs, 'where' | 'data'>;

export default async function updateDesign(
	{where, data}: UpdateDesignInput,
	ctx: Ctx
) {
	ctx.session.$authorize();

	if (data.stitchFileId) {
		await processImageUpload(data.stitchFileId as string);
	}

	const design = await db.design.update({where, data});

	return design;
}
