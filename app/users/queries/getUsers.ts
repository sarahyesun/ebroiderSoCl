import {Ctx, paginate} from 'blitz';
import db, {Prisma} from 'db';

export default async function getUsers({query, take, skip, where = {}}: {query?: string; take: number; skip: number; where?: Prisma.UserWhereInput}, ctx: Ctx) {
	ctx.session.$authorize(['ADMIN', 'MANUFACTURER']);

	const w: Prisma.UserWhereInput = where;

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
		count: () => db.user.count({where: w}),
		query: paginateArgs => db.user.findMany({
			...paginateArgs,
			where: w,
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
