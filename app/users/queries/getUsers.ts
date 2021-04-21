import {Ctx, paginate} from 'blitz';
import db, {Prisma} from 'db';

export default async function getUsers({query, take, skip}: {query?: string; take: number; skip: number}, ctx: Ctx) {
	ctx.session.$authorize('ADMIN');

	const where: Prisma.UserWhereInput = {};

	if (query) {
		where.OR = [
			{
				email: {
					contains: query,
					mode: 'insensitive'
				}
			},
			{
				name: {
					contains: query,
					mode: 'insensitive'
				}
			}
		];
	}

	const {items: users, hasMore, nextPage, count} = await paginate({
		skip,
		take,
		count: () => db.user.count({where}),
		query: paginateArgs => db.user.findMany({
			...paginateArgs,
			where,
			select: {id: true, name: true, email: true, role: true},
			orderBy: {
				name: 'asc'
			}
		})
	});

	return {
		users,
		nextPage,
		hasMore,
		count
	};
}
