import React, {Suspense} from 'react';
import {InfoIcon} from '@chakra-ui/icons';
import {Table, Thead, Tr, Th, Tbody, Td, Button, Skeleton} from '@chakra-ui/react';
import {Cart, CartItem, Order, OrderStatus, Prisma, User} from 'db';
import {Link, useAuthenticatedSession, useInfiniteQuery} from 'blitz';
import getOrders from '../queries/getOrders';

type OrdersTableProps = {
	showBuyer?: boolean;
};

type OrdersTableStaticProps = OrdersTableProps & {
	isLoading?: boolean;
	orders?: Array<Order & {cart: (Cart & {items: CartItem[]; user?: User})}>;
	hasNextPage?: boolean;
	fetchNextPage?: () => void;
	isFetchingNextPage?: boolean;
};

type OrdersTableLiveProps = OrdersTableProps & {
	where: Prisma.OrderWhereInput;
	showOwnOrdersOnly?: boolean;
};

const OrdersTableStatic = (props: OrdersTableStaticProps) => (
	<>
		<Table shadow="md" bg="white">
			<Thead>
				<Tr>
					<Th>ID</Th>
					<Th>Ordered At</Th>
					{
						props.showBuyer && (
							<Th>Buyer</Th>
						)
					}
					<Th>Status</Th>
					<Th>Items</Th>
				</Tr>
			</Thead>
			<Tbody>
				{
					props.isLoading ? Array.from(Array.from({length: 3}).keys()).map(id => (
						<Tr key={id}>
							<Td>
								<Skeleton isLoaded={!props.isLoading}>id</Skeleton>
							</Td>
							<Td>
								<Skeleton isLoaded={!props.isLoading}>yesterday</Skeleton>
							</Td>
							{
								props.showBuyer && (
									<Td>
										<Skeleton isLoaded={!props.isLoading}>you</Skeleton>
									</Td>
								)
							}
							<Td>
								<Skeleton isLoaded={!props.isLoading}>created</Skeleton>
							</Td>
							<Td>
								<Skeleton isLoaded={!props.isLoading}>2</Skeleton>
							</Td>
						</Tr>
					)) : props.orders?.map(order => (
						<Tr key={order.id}>
							<Td>
								{order.id}
							</Td>
							<Td>
								{order.cart.orderedAt?.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
								{' '}
								{order.cart.orderedAt?.toLocaleDateString()}
							</Td>
							{
								props.showBuyer && (
									<Td>
										{order.cart.user?.name}
									</Td>
								)
							}
							<Td>
								{order.status}
							</Td>
							<Td>
								<Link passHref href={`/orders/${order.id}`}>
									<Button size="sm" rightIcon={<InfoIcon/>} colorScheme="purple" as="a">
										{order.cart.items.length}
									</Button>
								</Link>
							</Td>
						</Tr>
					))
				}
			</Tbody>
		</Table>
		{
			props.hasNextPage && (
				<Button onClick={props.fetchNextPage} disabled={Boolean(props.isFetchingNextPage)} isFullWidth mt={4}>
        Load More
				</Button>
			)
		}
	</>
);

const OrdersTableLive = (props: OrdersTableLiveProps) => {
	const {userId} = useAuthenticatedSession();

	const [
		orderPages,
		{isFetchingNextPage, fetchNextPage, hasNextPage}
	] = useInfiniteQuery(
		getOrders,
		({take, skip} = {take: 10, skip: 0}) => ({
			where: {
				...props.where,
				...(props.showOwnOrdersOnly ? {cart: {userId}} : {})
			},
			orderBy: {createdAt: 'desc' as Prisma.SortOrder},
			include: {
				cart: {
					select: {
						orderedAt: true,
						items: true,
						user: true
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

	const flattenedOrders = orderPages.reduce<NonNullable<OrdersTableStaticProps['orders']>>((accum, page) => [...accum, ...(page.orders as NonNullable<OrdersTableStaticProps['orders']>)], []);

	return <OrdersTableStatic
		orders={flattenedOrders}
		hasNextPage={hasNextPage}
		fetchNextPage={fetchNextPage}
		isFetchingNextPage={isFetchingNextPage}
		{...props}/>;
};

const OrdersTable = (props: OrdersTableProps & OrdersTableLiveProps) => {
	return (
		<Suspense fallback={<OrdersTableStatic isLoading {...props}/>}>
			<OrdersTableLive {...props}/>
		</Suspense>
	);
};

export default OrdersTable;
