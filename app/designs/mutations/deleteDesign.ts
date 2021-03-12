import {Ctx} from 'blitz';
import db, {Prisma} from 'db';

type DeleteDesignInput = Pick<Prisma.DesignDeleteArgs, 'where'>;

export default async function deleteDesign(
	{where}: DeleteDesignInput,
	ctx: Ctx
) {
	ctx.session.$authorize();

	const design = await db.design.findUnique({where: {id: where.id}});

	if (!design) {
		throw new Error('Design not found');
	}

	if (design.userId !== ctx.session.userId && !ctx.session.roles.includes('ADMIN')) {
		throw new Error('Unauthorized');
	}

	await db.design.delete({where});

	return design;
}
