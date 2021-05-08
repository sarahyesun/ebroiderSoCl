import React, {Suspense, useCallback, useRef, useState} from 'react';
import {Address, Cart, CartItem, Design, Order, User} from 'db';
import {Box, Skeleton, VStack, Text, HStack, Tag, Spacer, Heading, SkeletonCircle, Button, Link, Divider, Table, Thead, Tbody, Th, Tr, Td, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure} from '@chakra-ui/react';
import {useQuery, useMutation} from '@blitzjs/core';
import getOrder from 'app/orders/queries/getOrder';
import Gravatar from 'react-gravatar';
import {DeleteIcon, DownloadIcon} from '@chakra-ui/icons';
import cancelOrderMutation from 'app/orders/mutations/cancelOrder';
import css from './styles/order-details.module.scss';

type OrderWithExtras = Order & {address: Address | null; cart: Cart & {user: User; items: Array<CartItem & {design: Design}>}};

const OrderDetailsStatic = ({order, isLoading = false, onRefetch}: {order?: OrderWithExtras | null; isLoading?: boolean; onRefetch?: () => Promise<unknown>}) => {
	const [waiting, setWaiting] = useState(false);
	const initialRef = useRef<HTMLButtonElement>(null);
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [cancelOrder] = useMutation(cancelOrderMutation);

	const handleOrderCancel = useCallback(async () => {
		setWaiting(true);
		if (order) {
			await cancelOrder({id: order.id});

			if (onRefetch) {
				await onRefetch();
			}
		}

		onClose();
		setWaiting(false);
	}, [cancelOrder, order, onRefetch]);

	return (
		<Box className={css.receipt}>
			<Box
				bg="white"
				p={8}
				d="grid"
				gridTemplateColumns={{md: '1fr 1fr'}}
				gridRowGap={6}
				position="relative">
				<VStack alignItems="flex-start" bg="white">
					<Heading mb={1}>Details</Heading>

					<Box d="grid" gridTemplateColumns="auto 1fr" gridRow="auto auto" gridColumnGap={2} gridRowGap={2}>
						<Text fontWeight="bold">ID:</Text>
						<Skeleton isLoaded={!isLoading}>
							{order?.id ?? 'cko258u8o0024lobkkqd5dfny'}
						</Skeleton>

						<Text fontWeight="bold">Date:</Text>
						<Skeleton isLoaded={!isLoading}>
							{order?.cart.orderedAt ? `${order.cart.orderedAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} ${order.cart.orderedAt.toLocaleDateString()}` : 'yesterday'}
						</Skeleton>

						<Text fontWeight="bold">Status:</Text>
						<Skeleton isLoaded={!isLoading}>
							<Tag colorScheme={'PAID' ? 'yellow' : 'green'}>
								{order?.status ?? 'PAID'}
							</Tag>
						</Skeleton>

						<Text fontWeight="bold">Receipt:</Text>
						<Skeleton isLoaded={!isLoading}>
							{order?.receiptUrl && (
								<Link rel="noreferrer noopener" target="_blank" color="purple.500" href={order.receiptUrl}>View Receipt</Link>
							)}
						</Skeleton>

						{
							order?.canceledAt && (
								<>
									<Text fontWeight="bold">Canceled At:</Text>
									<Text>
										{`${order.canceledAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} ${order.canceledAt.toLocaleDateString()}`}
									</Text>
								</>
							)
						}
					</Box>
				</VStack>

				{
					(order?.address || isLoading) ? (
						<VStack alignItems="flex-start">
							<Heading mb={1}>Address</Heading>

							<VStack as="address" spacing={2} alignItems="flex-start" w="full">
								<HStack w="full">
									<Skeleton isLoaded={!isLoading} w="full">
										<Text>{order?.address?.name ?? 'Name'}</Text>
									</Skeleton>
								</HStack>

								<Skeleton isLoaded={!isLoading} w="full">
									<Text>{order?.address?.line1 ?? 'Line 1'}</Text>
									<Text>{order?.address?.line2}</Text>
								</Skeleton>
								<Skeleton isLoaded={!isLoading} w="full">
									<Text>{order?.address?.city}, {order?.address?.state ?? 'MI'} {order?.address?.postalCode ?? '49931'}</Text>
								</Skeleton>
							</VStack>
						</VStack>
					) : (
						<VStack/>
					)
				}

				<Divider gridArea="span 1 / span 2" mt={4}/>

				<VStack alignItems="flex-start" gridArea="span 1 / span 2">
					<Heading>Items</Heading>

					<Table rounded="md" shadow="md" mb={4}>
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th isNumeric>Quantity</Th>
							</Tr>
						</Thead>
						<Tbody>
							{
								isLoading ? [-3, -2, -1].map(i => (
									<Tr key={i}>
										<Td><Skeleton>A sample design</Skeleton></Td>
										<Td><Skeleton>1</Skeleton></Td>
									</Tr>
								)) : order?.cart.items.map(i => (
									<Tr key={i.designId}>
										<Td>{i.design.name}</Td>
										<Td isNumeric>{i.quantity}</Td>
									</Tr>
								))
							}
						</Tbody>
					</Table>

					<HStack w="full">
						<Button
							as="a"
							href={`/api/orders/${order?.id ?? ''}/download`}
							colorScheme="blue"
							leftIcon={<DownloadIcon/>}
							disabled={isLoading}
							variant="ghost">
						Download all included designs
						</Button>

						<Spacer/>

						<Button
							leftIcon={<DeleteIcon/>}
							colorScheme="red"
							onClick={onOpen}
							disabled={isLoading || (Boolean(order?.canceledAt))}>Cancel Order</Button>
					</HStack>
				</VStack>

				<Box position="absolute" top={4} right={4}>
					<SkeletonCircle isLoaded={!isLoading} width="36px" height="36px">
						<Gravatar email={order?.cart.user.email} style={{borderRadius: '100px'}} width="36px"/>
					</SkeletonCircle>
				</Box>

				<Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Confirm</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
            Are you sure you want to cancel this order? The buyer will receive a refund.
						</ModalBody>

						<ModalFooter>
							<Button colorScheme="blue" mr={3} onClick={onClose} ref={initialRef} disabled={waiting}>
              Cancel
							</Button>
							<Button variant="ghost" colorScheme="red" onClick={handleOrderCancel} isLoading={waiting}>Confirm</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</Box>
		</Box>
	);
};

const OrderDetailsLive = ({id}: {id: string}) => {
	const [order, {refetch}] = useQuery(getOrder, {
		where: {id},
		include: {
			address: true,
			cart: {
				include: {
					items: {
						select: {
							designId: true,
							quantity: true,
							design: true
						}
					},
					user: true
				}
			}
		}
	});

	return <OrderDetailsStatic order={order as OrderWithExtras} onRefetch={refetch}/>;
};

const OrderDetails = ({id}: {id?: string}) => {
	if (!id) {
		return <OrderDetailsStatic isLoading/>;
	}

	return (
		<Suspense fallback={<OrderDetailsStatic isLoading/>}>
			<OrderDetailsLive id={id}/>
		</Suspense>
	);
};

export default OrderDetails;
