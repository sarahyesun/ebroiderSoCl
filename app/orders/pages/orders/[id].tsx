import React from 'react';
import {BlitzPage, useParam} from '@blitzjs/core';
import Layout from 'app/layouts/Layout';
import OrderDetails from 'app/orders/components/order-details';

const OrderPage: BlitzPage = () => {
	const id = useParam('id');

	return (
		<OrderDetails id={id as string | undefined}/>
	);
};

OrderPage.getLayout = page => <Layout title={'Order Details'} header="Order" bg="gray.50">{page}</Layout>;
OrderPage.authenticate = true;

export default OrderPage;
