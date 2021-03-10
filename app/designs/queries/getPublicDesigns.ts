import {Ctx} from 'blitz';
import db, {Prisma} from 'db';

type GetDesignsInput = Pick<
Prisma.FindManyDesignArgs,
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
		skip
	});

	const count = await db.design.count();
	const hasMore = typeof take === 'number' ? skip + take < count : false;
	const nextPage = hasMore ? {take, skip: skip + take!} : null;

	return {
		designs,
		nextPage,
		hasMore,
		count
	};
}
