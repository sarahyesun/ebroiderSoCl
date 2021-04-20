import {Ctx, NotFoundError} from 'blitz';
import db, {Prisma} from 'db';

type GetDesignInput = Pick<Prisma.DesignFindFirstArgs, 'where'>;

export default async function getDesign({where}: GetDesignInput, ctx: Ctx) {
	let protectedWhere: Prisma.DesignFindFirstArgs['where'];

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
		where: protectedWhere,
		include: {
			pictures: {
				orderBy: {
					order: 'asc'
				}
			}
		}
	});

	if (!design) {
		throw new NotFoundError();
	}

	return design;
}
