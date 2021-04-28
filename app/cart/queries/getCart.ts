import {Ctx} from 'blitz';
import db from 'db';

// eslint-disable-next-line @typescript-eslint/default-param-last
export default async function getCart(_ = null, ctx: Ctx) {
	if (!ctx.session.userId) {
		return null;
	}

	const include = {
		items: {
			include: {
				design: true
			}
		}
	};

	let cart = await db.cart.findFirst({
		where: {userId: ctx.session.userId},
		include
	});

	if (!cart) {
		cart = await db.cart.create({
			data: {
				userId: ctx.session.userId
			},
			include
		});
	}

	return cart;
}
