import {Ctx, paginate} from 'blitz';
import db, {Prisma} from 'db';

type GetOrdersInput = Pick<Prisma.OrderFindManyArgs, 'where' | 'include' | 'orderBy' | 'take' | 'skip'>;

export default async function getOrders({where = {}, include, orderBy, take, skip}: GetOrdersInput, ctx: Ctx) {
	ctx.session.$authorize();

	const protectedWhere: Prisma.OrderFindManyArgs['where'] = ctx.session.roles.includes('ADMIN') ? where : {
		AND: [
			where,
			{
				OR: [
					{
						assignedToId: ctx.session.userId
					},
					{
						cart: {
							userId: ctx.session.userId
						}
					}
				]
			}
		]
	};

	const {items: orders, hasMore, nextPage, count} = await paginate({
		skip,
		take,
		count: () => db.order.count({where: protectedWhere}),
		query: paginateArgs => db.order.findMany({
			...paginateArgs,
			where: protectedWhere,
			include,
			orderBy
		})
	});

	return {
		orders,
		nextPage,
		hasMore,
		count
	};
}
