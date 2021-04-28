import {useCallback, useMemo} from 'react';
import {useQuery, useMutation} from 'blitz';
import getCart from 'app/cart/queries/getCart';
import updateCart from 'app/cart/mutations/updateCart';
import {Design} from 'db';

export const useCart = () => {
	const [cart, {refetch}] = useQuery(getCart, null);
	const [updateCartMutation] = useMutation(updateCart);

	const id = cart?.id ?? null;
	const items = cart?.items ?? [];

	const addDesignIdToCart = useCallback(async (designId: Design['id'], quantity = 1) => {
		await (items.some(i => i.designId === designId) ? updateCartMutation({
			where: {
				id: id!
			},
			data: {
				items: {
					update: {
						where: {
							cartId_designId: {
								cartId: id!,
								designId
							}
						},
						data: {
							quantity: {
								increment: 1
							}
						}
					}
				}
			}
		}) : updateCartMutation({
			where: {
				id: id!
			},
			data: {
				items: {
					connectOrCreate: [
						{
							where: {
								cartId_designId: {
									cartId: id!,
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
		}));

		await refetch();
	}, [updateCartMutation, id]);

	const removeDesignIdFromCart = useCallback(async (designId: Design['id']) => {
		await updateCartMutation({
			where: {
				id: id!
			},
			data: {
				items: {
					delete: {
						cartId_designId: {
							cartId: id!,
							designId
						}
					}
				}
			}
		});

		await refetch();
	}, [updateCartMutation, id]);

	const updateDesignIdQuantity = useCallback(async (designId: Design['id'], quantity = 1) => {
		if (quantity === 0) {
			await removeDesignIdFromCart(designId);
		} else {
			await updateCartMutation({
				where: {
					id: id!
				},
				data: {
					items: {
						update: {
							where: {
								cartId_designId: {
									cartId: id!,
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
	}, [updateCartMutation, id]);

	const total = useMemo(() => {
		let t = 0;

		for (const item of items) {
			t += item.design.price * item.quantity;
		}

		return t;
	}, [items]);

	const numberOfItems = useMemo(() => {
		let n = 0;

		for (const item of items) {
			n += item.quantity;
		}

		return n;
	}, [items]);

	return {
		total,
		items,
		numOfItems: numberOfItems,
		addDesignIdToCart,
		removeDesignIdFromCart,
		updateDesignIdQuantity
	};
};
