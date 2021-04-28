import {Ctx} from 'blitz';
import db, {Prisma} from 'db';

type UpdateCartInput = Pick<Prisma.CartUpdateArgs, 'where' | 'data'>;

export default async function updateCart({where, data}: UpdateCartInput, ctx: Ctx) {
	ctx.session.$authorize();

	const cart = await db.cart.findFirst({where});

	if (cart?.userId !== ctx.session.userId) {
		throw new Error('Unauthorized');
	}

	// TODO: protect against adding non-public non-user owned designs to cart

	return db.cart.update({where, data});
}
