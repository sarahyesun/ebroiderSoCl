import {useCallback, useMemo} from 'react';
import {useQuery, useMutation} from 'blitz';
import getCart from 'app/cart/queries/getCart';
import updateCart from 'app/cart/mutations/updateCart';
import {Design} from 'db';

export const useCart = () => {
	const [cart, {refetch}] = useQuery(getCart, null);
	const [updateCartMutation] = useMutation(updateCart);

	const addDesignIdToCart = useCallback(async (designId: Design['id'], quantity = 1) => {
		await updateCartMutation({
			where: {
				id: cart.id
			},
			data: {
				items: {
					connectOrCreate: [
						{
							where: {
								cartId_designId: {
									cartId: cart.id,
									designId
								}
							},
							create: {
								designId,
								quantity
							}
						}
					]
				}
			}
		});

		await refetch();
	}, [updateCartMutation, cart]);

	const removeDesignIdFromCart = useCallback(async (designId: Design['id']) => {
		await updateCartMutation({
			where: {
				id: cart.id
			},
			data: {
				items: {
					delete: {
						cartId_designId: {
							cartId: cart.id,
							designId
						}
					}
				}
			}
		});

		await refetch();
	}, [updateCartMutation, cart]);

	const updateDesignIdQuantity = useCallback(async (designId: Design['id'], quantity = 1) => {
		if (quantity === 0) {
			await removeDesignIdFromCart(designId);
		} else {
			await updateCartMutation({
				where: {
					id: cart.id
				},
				data: {
					items: {
						update: {
							where: {
								cartId_designId: {
									cartId: cart.id,
									designId
								}
							},
							data: {
								quantity
							}
						}
					}
				}
			});

			await refetch();
		}
	}, [updateCartMutation, cart]);

	const total = useMemo(() => {
		let t = 0;

		for (const item of cart.items) {
			t += item.design.price * item.quantity;
		}

		return t;
	}, [cart.items]);

	return {
		total,
		items: cart.items,
		addDesignIdToCart,
		removeDesignIdFromCart,
		updateDesignIdQuantity
	};
};
