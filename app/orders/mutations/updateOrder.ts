import {AuthorizationError, Ctx} from 'blitz';
import db, {Prisma} from 'db';

type UpdateOrderInput = Pick<Prisma.OrderUpdateArgs, 'data' | 'where'>;

export default async function updateOrder({data, where}: UpdateOrderInput, ctx: Ctx) {
	ctx.session.$authorize();

	const order = await db.order.findFirst({where, include: {cart: true}});

	if (order?.assignedToId === ctx.session.userId || order?.cart.userId === ctx.session.userId || ctx.session.roles.includes('ADMIN')) {
		return db.order.update({where, data});
	}

	throw new AuthorizationError('Not allowed to update order.');
}
