import {Ctx} from 'blitz';
import db, {Prisma} from 'db';
import processImageUpload from 'utils/process-image-upload';

type UpdateDesignInput = Pick<Prisma.DesignUpdateArgs, 'where' | 'data'>;

export default async function updateDesign(
	{where, data}: UpdateDesignInput,
	ctx: Ctx
) {
	ctx.session.$authorize();

	const isAdmin = ctx.session.roles.includes('ADMIN');

	const existingDesign = await db.design.findUnique({where});

	if (!existingDesign) {
		throw new Error('Design not found');
	}

	if (existingDesign.userId !== ctx.session.userId && !isAdmin) {
		throw new Error('Unauthorized');
	}

	if (data.stitchFileId && data.stitchFileId !== existingDesign.stitchFileId) {
		await processImageUpload(data.stitchFileId as string);
	}

	// Protect fields
	if (!isAdmin) {
		delete data.isApproved;
		delete data.price;
	}

	const design = await db.design.update({where, data});

	return design;
}
