import {Ctx} from 'blitz';
import db, {Prisma, prismaVersion} from 'db';
import processImageUpload from 'utils/process-image-upload';

type UpdateDesignInput = Pick<Prisma.DesignUpdateArgs, 'where' | 'data'>;

export default async function updateDesign(
	{where, data}: UpdateDesignInput,
	ctx: Ctx
) {
	ctx.session.$authorize();

	const existingDesign = await db.design.findUnique({where});

	if (!existingDesign) {
		throw new Error('Design not found');
	}

	if (existingDesign.userId !== ctx.session.userId && !ctx.session.roles.includes('ADMIN')) {
		throw new Error('Unauthorized');
	}

	if (data.stitchFileId) {
		await processImageUpload(data.stitchFileId as string);
	}

	const design = await db.design.update({where, data});

	return design;
}
