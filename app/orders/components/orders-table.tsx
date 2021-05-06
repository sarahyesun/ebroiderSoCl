import React, {Suspense, useCallback, useState} from 'react';
import {InfoIcon, WarningIcon} from '@chakra-ui/icons';
import {Table, Thead, Tr, Th, Tbody, Td, Button, Skeleton, Tag, useTimeout, Select} from '@chakra-ui/react';
import {Cart, CartItem, Order, Prisma, User} from 'db';
import {Link, useAuthenticatedSession, useInfiniteQuery, useMutation, useQuery} from 'blitz';
import getOrders from '../queries/getOrders';
import getUsers from 'app/users/queries/getUsers';
import updateOrder from '../mutations/updateOrder';

type OrdersTableProps = {
	showBuyer?: boolean;
};

type OrdersTableStaticProps = OrdersTableProps & {
	isLoading?: boolean;
	orders?: Array<Order & {cart: (Cart & {items: CartItem[]; user?: User}); assignedTo?: User}>;
	hasNextPage?: boolean;
	fetchNextPage?: () => void;
	isFetchingNextPage?: boolean;
	allowManufacturerAssignment?: boolean;
};

type OrdersTableLiveProps = OrdersTableProps & {
	where: Prisma.OrderWhereInput;
	showOwnOrdersOnly?: boolean;
};

const ManufacturerSelect = ({orderId, currentManufacturer}: {orderId: Order['id']; currentManufacturer: User['id'] | null}) => {
	const [userPages] = useQuery(getUsers, {where: {role: 'MANUFACTURER'}, take: 100, skip: 0});

	const possibleManufacturers = userPages.users;

	const [updateOrderMutation, {isLoading, isSuccess}] = useMutation(updateOrder);
	const [value, setValue] = useState(currentManufacturer);
	const [changeSuccess, setChangeSuccess] = useState(false);

	useTimeout(() => {
		setChangeSuccess(false);
	}, isSuccess ? 500 : null);

	const handleChange = useCallback(async (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {value} = event.target;

		const result = await updateOrderMutation({
			where: {id: orderId},
			data: {
				assignedToId: value === 'none' ? null : Number.parseInt(value, 10)
			}
		});

		setValue(result.assignedToId);
		setChangeSuccess(true);
	}, []);

	return (
		<Select
			disabled={isLoading}
			bg={changeSuccess ? 'green.200' : 'transparent'}
			onChange={handleChange}
			icon={value === null ? <WarningIcon/> : undefined}
			size="sm">
			<option value="none" selected={value === null}>Unassigned</option>
			{
				possibleManufacturers.map(m => (
					<option key={m.id} value={m.id.toString()} selected={m.id === value}>{m.name}</option>
				))
			}
		</Select>
	);
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
					<Th>Manufacturer</Th>
					<Th>Status</Th>
					<Th>Items</Th>
				</Tr>
			</Thead>
			<Tbody>
				{
					props.isLoading ? Array.from(Array.from({length: 3}).keys()).map(id => (
						<Tr key={id}>
							<Td>
								<Skeleton isLoaded={!props.isLoading}>cko64n6ed1963kcbk5yvke65g</Skeleton>
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
								<Skeleton isLoaded={!props.isLoading}>Manufacturer</Skeleton>
							</Td>
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
								{
									props.allowManufacturerAssignment ? (
										<ManufacturerSelect orderId={order.id} currentManufacturer={order.assignedToId}/>
									) : (
										order.assignedTo ? order.assignedTo.name : (
											<Tag colorScheme="yellow">Unassigned</Tag>
										)
									)
								}
							</Td>
							<Td>
								<Tag>
									{order.status}
								</Tag>
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
	const session = useAuthenticatedSession();

	const [
		orderPages,
		{isFetchingNextPage, fetchNextPage, hasNextPage}
	] = useInfiniteQuery(
		getOrders,
		({take, skip} = {take: 10, skip: 0}) => ({
			where: {
				...props.where,
				...(props.showOwnOrdersOnly ? {cart: {userId: session.userId}} : {})
			},
			orderBy: {createdAt: 'desc' as Prisma.SortOrder},
			include: {
				assignedTo: true,
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
		allowManufacturerAssignment={session.roles.includes('ADMIN')}
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
