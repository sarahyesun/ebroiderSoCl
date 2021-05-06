import React from 'react';
import {BlitzPage} from 'blitz';
import Layout from 'app/layouts/Layout';
import OrdersTable from 'app/orders/components/orders-table';

const OrdersPage: BlitzPage = () => {
	return (
		<OrdersTable showBuyer where={{}}/>
	);
};

OrdersPage.getLayout = page => <Layout title={'Manage Orders'} header="Orders" bg="gray.50">{page}</Layout>;
OrdersPage.authenticate = true;

export default OrdersPage;
