import React, {useState, useCallback} from 'react';
import {Select, useTimeout} from '@chakra-ui/react';
import getUsers from 'app/users/queries/getUsers';
import {useQuery, useMutation} from 'blitz';
import {Order, User} from 'db';
import updateOrder from 'app/orders/mutations/updateOrder';
import {WarningIcon} from '@chakra-ui/icons';

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
			value={value ?? 'none'}
			size="sm">
			<option value="none">Unassigned</option>
			{
				possibleManufacturers.map(m => (
					<option key={m.id} value={m.id}>{m.name}</option>
				))
			}
		</Select>
	);
};

export default ManufacturerSelect;
