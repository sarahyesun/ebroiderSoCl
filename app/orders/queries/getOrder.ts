import {AuthorizationError, Ctx} from 'blitz';
import db, {Prisma} from 'db';

type GetOrderInput = Pick<Prisma.OrderFindUniqueArgs, 'where' | 'include'>;

export default async function getOrder({where, include}: GetOrderInput, ctx: Ctx) {
	ctx.session.$authorize();

	const order = await db.order.findUnique({where, include: {cart: true}});

	if (!order) {
		return null;
	}

	await new Promise<void>(resolve => {
		setTimeout(() => {
			resolve();
		}, 2000);
	});

	if (order.cart.userId === ctx.session.userId || order.assignedToId === ctx.session.userId || ctx.session.roles.includes('ADMIN')) {
		return db.order.findUnique({where, include});
	}

	throw new AuthorizationError('Not allowed to access order.');
}
