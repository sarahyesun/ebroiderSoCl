import React from 'react';
import Layout from 'app/layouts/Layout';
import {BlitzPage} from 'blitz';
import OrdersTable from 'app/orders/components/orders-table';
import {OrderStatus} from 'db';

const ManufacturerPage: BlitzPage = () => {
	return (
		<OrdersTable showAssignedOrdersOnly where={{status: {not: OrderStatus.CREATED}}}/>
	);
};

ManufacturerPage.getLayout = page => <Layout title={'Assigned Orders'} header="Assigned Orders" bg="gray.50">{page}</Layout>;
ManufacturerPage.authenticate = true;

export default ManufacturerPage;
