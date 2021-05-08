import {AuthorizationError, Ctx} from 'blitz';
import db, {Order} from 'db';
import stripe from 'utils/stripe';

export default async function cancelOrder({id}: {id: Order['id']}, ctx: Ctx) {
	ctx.session.$authorize();

	const order = await db.order.findFirst({where: {id}, include: {cart: true}});

	if (order && (order?.assignedToId === ctx.session.userId || order?.cart.userId === ctx.session.userId || ctx.session.roles.includes('ADMIN')) && order.paymentIntentId && !order.canceledAt) {
		await stripe.refunds.create({payment_intent: order.paymentIntentId});
		await db.order.update({
			where: {
				id
			},
			data: {
				canceledAt: new Date()
			}
		});
		return;
	}

	throw new AuthorizationError('Not allowed to cancel order.');
}
