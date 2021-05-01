import React, {Suspense} from 'react';
import {BlitzPage, useParam} from '@blitzjs/core';
import {Container, Box, Heading} from '@chakra-ui/react';
import Layout from 'app/layouts/Layout';
import OrderDetails from 'app/orders/components/order-details';

const OrderPage: BlitzPage = () => {
	const id = useParam('id');

	if (!id) {
		return null;
	}

	return (
		<Container size="lg">
			<Box justifyContent="space-between" flexGrow={1} display="flex" mb={10}>
				<Heading>Order</Heading>
			</Box>

			<OrderDetails id={id as string}/>
		</Container>
	);
};

OrderPage.getLayout = page => <Layout title={'Order Details'} bg="gray.50">{page}</Layout>;
OrderPage.authenticate = true;

export default OrderPage;
