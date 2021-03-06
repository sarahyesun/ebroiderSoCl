import {Ctx} from 'blitz';
import db, {Prisma} from 'db';

type GetDesignsInput = Pick<
Prisma.DesignFindManyArgs,
'orderBy' | 'skip' | 'take'
>;

export default async function getDesigns({orderBy, skip = 0, take}: GetDesignsInput) {
	const designs = await db.design.findMany({
		where: {
			isPublic: true,
			isApproved: true
		},
		orderBy,
		take,
		skip,
		include: {
			pictures: {
				take: 1,
				orderBy: {
					order: 'asc'
				}
			},
			files: true
		}
	});

	const count = await db.design.count({where: {isPublic: true, isApproved: true}});
	const hasMore = typeof take === 'number' ? skip + take < count : false;
	const nextPage = hasMore ? {take, skip: skip + take!} : null;

	return {
		designs,
		nextPage,
		hasMore,
		count
	};
}
