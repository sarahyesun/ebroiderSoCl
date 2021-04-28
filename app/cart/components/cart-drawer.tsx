import React from 'react';
import {Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, HStack, Spacer, Text, VStack, Box} from '@chakra-ui/react';
import {useCart} from 'app/hooks/useCart';
import CartItem from './cart-item';

const currencyFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

const CartDrawer = ({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) => {
	const {items, total, updateDesignIdQuantity} = useCart();

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

					<DrawerFooter>
						<VStack w="full" spacing={4}>
							<HStack w="full">
								<Text fontWeight="bold">Total:</Text>

								<Spacer/>

								<Text>{currencyFormat.format(total / 100)}</Text>
							</HStack>

							<Button colorScheme="green" isFullWidth>Checkout</Button>
						</VStack>
					</DrawerFooter>
				</DrawerContent>
			</DrawerOverlay>
		</Drawer>
	);
};

export default CartDrawer;
