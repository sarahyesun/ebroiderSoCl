import Stripe from 'stripe';

export default new Stripe(process.env.STRIPE_SECRET!, {
	apiVersion: '2020-08-27'
});
