import React, {Suspense} from 'react';
import {BlitzPage, Link, useInfiniteQuery} from '@blitzjs/core';
import {Box, Heading, Container, Button, Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';
import getOrders from 'app/orders/queries/getOrders';
import Layout from 'app/layouts/Layout';
import {InfoIcon} from '@chakra-ui/icons';
import {OrderStatus, Prisma} from 'db';

const OrdersTable = () => {
	const [
		orderPages,
		{isFetchingNextPage, fetchNextPage, hasNextPage}
	] = useInfiniteQuery(
		getOrders,
		({take, skip} = {take: 10, skip: 0}) => ({
			where: {status: 'PAID' as OrderStatus},
			orderBy: {createdAt: 'desc' as Prisma.SortOrder},
			include: {
				cart: {
					include: {
						items: true
					}
				}
			},
			take,
			skip
		}),
		{
			getNextPageParam: lastPage => lastPage.nextPage
		}
	);

	return (
		<>
			<Table shadow="md" bg="white">
				<Thead>
					<Tr>
						<Th>ID</Th>
						<Th>Ordered At</Th>
						<Th>Status</Th>
						<Th>Items</Th>
					</Tr>
				</Thead>
				<Tbody>
					{
						orderPages.map(orderPage => orderPage.orders.map(order => (
							<Tr key={order.id}>
								<Td>
									{order.id}
								</Td>
								<Td>
									{order.createdAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
									{' '}
									{order.createdAt.toLocaleDateString()}
								</Td>
								<Td>
									{order.status}
								</Td>
								<Td>
									<Link passHref href={`/orders/${order.id}`}>
										<Button size="sm" rightIcon={<InfoIcon/>} colorScheme="purple" as="a">
											{(order as any).cart.items.length}
										</Button>
									</Link>
								</Td>
							</Tr>
						)))
					}
				</Tbody>
			</Table>
			{
				hasNextPage && (
					<Button onClick={async () => fetchNextPage()} disabled={Boolean(isFetchingNextPage)} isFullWidth mt={4}>
        Load More
					</Button>
				)
			}
		</>
	);
};

const MyOrdersPage: BlitzPage = () => {
	return (
		<Suspense fallback={<div/>}>
			<OrdersTable/>
		</Suspense>
	);
};

MyOrdersPage.getLayout = page => <Layout title={'My Orders'} header="My Orders" bg="gray.50">{page}</Layout>;
MyOrdersPage.authenticate = true;

export default MyOrdersPage;
