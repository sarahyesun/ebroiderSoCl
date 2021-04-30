import React, {useState, useCallback} from 'react';
import {VStack, HStack, Spacer, Input, IconButton, Tag, Text} from '@chakra-ui/react';
import {CheckIcon, DeleteIcon} from '@chakra-ui/icons';

const currencyFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

const CartItem = ({name, quantity: q, price, onUpdateQuantity}: {name: string; quantity: number; price: number; onUpdateQuantity: (newQuantity: number) => Promise<void>}) => {
	const [quantity, setQuantity] = useState(q);
	const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
	const subTotal = currencyFormat.format(price / 100);
	const total = currencyFormat.format(q * (price / 100));

	const handleQuantityChange = useCallback(async (event: React.FormEvent) => {
		event.preventDefault();

		await onUpdateQuantity(quantity);
		setIsUpdatingQuantity(false);
	}, [quantity]);

	return (
		<VStack w="full" mb={6}>
			<HStack w="full">
				<Text noOfLines={1}>{name}</Text>

				<Spacer/>

				<Text>{subTotal}</Text>
			</HStack>
			<HStack w="full">
				{
					isUpdatingQuantity ? (
						<form onSubmit={handleQuantityChange}>
							<Input
								size="sm"
								w="5ch"
								type="number"
								placeholder="1"
								required
								value={quantity}
								autoFocus
								onChange={event => {
									setQuantity(Number.parseInt(event.target.value, 10));
								}}/>

							<IconButton
								ml={3}
								type="submit"
								colorScheme="green"
								icon={<CheckIcon/>}
								size="sm"
								aria-label="Update"/>

							<IconButton
								ml={3}
								colorScheme="red"
								icon={<DeleteIcon/>}
								aria-label="Delete"
								size="sm"
								onClick={async () => onUpdateQuantity(0)}/>
						</form>
					) : (
						<Tag
							size="md"
							aria-label="Update quantity"
							colorScheme="green"
							_hover={{cursor: 'pointer'}}
							py={2}
							as="button"
							onClick={() => {
								setIsUpdatingQuantity(true);
							}}>
							x{quantity}
						</Tag>
					)
				}

				<Spacer/>

				<Text>{total}</Text>
			</HStack>
		</VStack>
	);
};

export default CartItem;
