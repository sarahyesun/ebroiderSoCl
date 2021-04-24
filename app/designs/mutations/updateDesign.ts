import {Ctx} from 'blitz';
import db, {Prisma} from 'db';
import processImageUpload from 'utils/process-image-upload';
import diff from 'arr-diff';

type UpdateDesignInput = Pick<Prisma.DesignUpdateArgs, 'where' | 'data'>;

export default async function updateDesign(
	{where, data}: UpdateDesignInput,
	ctx: Ctx
) {
	ctx.session.$authorize();

	const isAdmin = ctx.session.roles.includes('ADMIN');

	const existingDesign = await db.design.findUnique({where, include: {files: true}});

	if (!existingDesign) {
		throw new Error('Design not found');
	}

	if (existingDesign.userId !== ctx.session.userId && !isAdmin) {
		throw new Error('Unauthorized');
	}

	if (Array.isArray(data.files?.connect)) {
		const connect = data.files?.connect!;

		if (diff(existingDesign.files.map(f => f.id), (connect).map(f => f.id)).length > 0) {
			await processImageUpload(existingDesign, connect[0].id!);
		}
	}

	// Protect fields
	if (!isAdmin) {
		delete data.isApproved;
		delete data.price;
	}

	const design = await db.design.update({where, data, include: {pictures: true, files: true}});

	return design;
}
