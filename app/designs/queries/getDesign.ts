import {Ctx, NotFoundError} from 'blitz';
import db, {Prisma} from 'db';

type GetDesignInput = Pick<Prisma.FindFirstDesignArgs, 'where'>;

export default async function getDesign({where}: GetDesignInput, ctx: Ctx) {
	let protectedWhere: Prisma.FindFirstDesignArgs['where'];

	if (ctx.session.roles) {
		protectedWhere = ctx.session.roles.includes('ADMIN') ? where : {
			OR: [
				{
					...where,
					userId: ctx.session.userId!
				},
				{
					...where,
					isPublic: true,
					isApproved: true
				}
			]
		};
	} else {
		protectedWhere = {
			...where,
			isPublic: true,
			isApproved: true
		};
	}

	const design = await db.design.findFirst({
		where: protectedWhere
	});

	if (!design) {
		throw new NotFoundError();
	}

	return design;
}
