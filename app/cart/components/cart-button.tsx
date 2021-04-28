import React from 'react';
import {Box, IconButton, Badge, useDisclosure} from '@chakra-ui/react';
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import CartDrawer from './cart-drawer';
import {useCart} from 'app/hooks/useCart';

const CartButton = () => {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {numOfItems} = useCart();

	return (
		<Box position="relative" mr="1rem">
			<IconButton
				aria-label="View cart"
				icon={<FontAwesomeIcon icon={faShoppingCart} />}
				colorScheme="gray"
				variant="ghost"
				_hover={{background: 'white', color: 'black'}}
				onClick={onOpen}
			/>

			{
				numOfItems > 0 && (
					<Badge
						fontSize="xs"
						position="absolute"
						colorScheme="purple"
						variant="solid"
						top={0}
						right={0}>
						{numOfItems}
					</Badge>
				)
			}

			<CartDrawer isOpen={isOpen} onClose={onClose}/>
		</Box>
	);
};

export default CartButton;
