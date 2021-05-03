import React, {useCallback, useState} from 'react';
import {Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, HStack, Spacer, Text, VStack, Box} from '@chakra-ui/react';
import {loadStripe} from '@stripe/stripe-js';
import {useMutation} from 'blitz';
import {useCart} from 'app/hooks/useCart';
import CartItem from './cart-item';
import createOrder from 'app/orders/mutations/createOrder';

const currencyFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC!);

const CartDrawer = ({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [createOrderMutation] = useMutation(createOrder);
	const {items, total, updateDesignIdQuantity, id} = useCart();

	const handleCheckout = useCallback(async () => {
		setIsLoading(true);
		const {sessionId} = await createOrderMutation({data: {cartId: id!}, cancelUrl: window.location.toString()});
		const stripe = await stripePromise;

		await stripe?.redirectToCheckout({sessionId});
		setIsLoading(false);
	}, [createOrderMutation, id]);

	return (
		<Drawer isOpen={isOpen} onClose={onClose} placement="right">
			<DrawerOverlay>
				<DrawerContent>
					<DrawerCloseButton/>

					<DrawerHeader>Cart</DrawerHeader>

					<DrawerBody>
						<Box mb={12}>
							{
								items.map(i => (
									<CartItem
										key={i.designId}
										name={i.design.name}
										quantity={i.quantity}
										price={i.design.price}
										onUpdateQuantity={async n => updateDesignIdQuantity(i.designId, n)}/>
								)
								)}
						</Box>

						{
							items.length === 0 && (
								<HStack>
									<Text color="gray.400" textAlign="center">You don't have anything in your cart yet.</Text>
								</HStack>
							)
						}
					</DrawerBody>

					{items.length > 0 && (
						<DrawerFooter>
							<VStack w="full" spacing={4}>
								<HStack w="full">
									<Text fontWeight="bold">Total:</Text>

									<Spacer/>

									<Text>{currencyFormat.format(total / 100)}</Text>
								</HStack>

								<Button colorScheme="green" isFullWidth onClick={handleCheckout} isLoading={isLoading}>Checkout</Button>
							</VStack>
						</DrawerFooter>
					)}
				</DrawerContent>
			</DrawerOverlay>
		</Drawer>
	);
};

export default CartDrawer;
