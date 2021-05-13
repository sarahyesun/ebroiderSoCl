import React from 'react';
import {BlitzPage} from '@blitzjs/core';
import Layout from 'app/layouts/Layout';
import OrdersTable from 'app/orders/components/orders-table';
import {OrderStatus} from 'db';

const MyOrdersPage: BlitzPage = () => {
	return (
		<OrdersTable where={{status: {not: OrderStatus.CREATED}}} showOwnOrdersOnly/>
	);
};

MyOrdersPage.getLayout = page => <Layout title={'My Orders'} header="My Orders" bg="gray.50">{page}</Layout>;
MyOrdersPage.authenticate = true;

export default MyOrdersPage;
