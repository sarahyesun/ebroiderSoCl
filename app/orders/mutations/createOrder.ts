import {Ctx} from 'blitz';
import db, {Prisma} from 'db';
import stripe from 'utils/stripe';

type CreateOrderInput = Pick<Prisma.OrderCreateArgs, 'data'> & {cancelUrl: string};

export default async function createOrder({data, cancelUrl}: CreateOrderInput, ctx: Ctx) {
	ctx.session.$authorize();

	const order = await db.order.create({
		data,
		include: {
			cart: {
				include: {
					items: {
						include: {
							design: true
						}
					}
				}
			}
		}
	});

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		shipping_rates: ['shr_1IlN7qFEr7i81Gv0fBbLmTIk'],
		shipping_address_collection: {
			allowed_countries: ['US']
		},
		line_items: order.cart.items.map(i => ({
			price_data: {
				currency: 'usd',
				product_data: {
					name: i.design.name
				},
				unit_amount: i.design.price
			},
			quantity: i.quantity
		})),
		mode: 'payment',
		success_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/checkout/success`,
		cancel_url: cancelUrl
	});

	await db.order.update({
		where: {
			id: order.id
		},
		data: {
			paymentIntentId: session.payment_intent as string
		}
	});

	return {order, sessionId: session.id};
}
