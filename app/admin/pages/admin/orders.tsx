import React from 'react';
import {BlitzPage} from 'blitz';
import Layout from 'app/layouts/Layout';
import OrdersTable from 'app/orders/components/orders-table';
import {OrderStatus} from 'db';

const OrdersPage: BlitzPage = () => {
	return (
		<OrdersTable showBuyer where={{status: {not: OrderStatus.CREATED}}}/>
	);
};

OrdersPage.getLayout = page => <Layout title={'Manage Orders'} header="Orders" bg="gray.50">{page}</Layout>;
OrdersPage.authenticate = true;

export default OrdersPage;
