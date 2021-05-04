import type {NextApiRequest, NextApiResponse} from 'next';
import db, {OrderStatus} from 'db';

const handleStripeEvent = async (request: NextApiRequest, response: NextApiResponse) => {
	const event = request.body;

	if (event.type === 'payment_intent.succeeded') {
		const data = event.data.object;

		const {shipping: {address, name}, charges, id} = data;

		const savedAddress = await db.address.create({
			data: {
				city: address.city,
				country: address.country,
				line1: address.line1,
				line2: address.line2,
				postalCode: address.postal_code,
				state: address.state,
				name
			}
		});

		let receiptUrl = null;

		if (charges.data.length > 0) {
			receiptUrl = charges.data[0].receipt_url;
		}

		const order = await db.order.update({
			where: {
				paymentIntentId: id
			},
			data: {
				status: OrderStatus.PAID,
				addressId: savedAddress.id,
				receiptUrl
			}
		});

		await db.cart.update({
			where: {
				id: order.cartId
			},
			data: {
				orderedAt: new Date()
			}
		});

		response.status(200).end();

		// TODO: send confirmation email
	}
};

export default handleStripeEvent;
