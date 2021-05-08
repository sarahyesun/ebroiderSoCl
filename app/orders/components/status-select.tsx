import React, {useState, useCallback} from 'react';
import {Select, useTimeout} from '@chakra-ui/react';
import updateOrder from 'app/orders/mutations/updateOrder';
import {useMutation} from 'blitz';
import {OrderStatus, Order} from 'db';

const StatusSelect = ({orderId, currentStatus}: {orderId: Order['id']; currentStatus: OrderStatus}) => {
	const [updateOrderMutation, {isLoading, isSuccess}] = useMutation(updateOrder);
	const [value, setValue] = useState(currentStatus);
	const [changeSuccess, setChangeSuccess] = useState(false);

	useTimeout(() => {
		setChangeSuccess(false);
	}, isSuccess ? 500 : null);

	const handleChange = useCallback(async (event: React.ChangeEvent<HTMLSelectElement>) => {
		const result = await updateOrderMutation({where: {id: orderId}, data: {status: event.target.value as OrderStatus}});

		setValue(result.status);
		setChangeSuccess(true);
	}, []);

	return (
		<Select
			disabled={isLoading}
			bg={changeSuccess ? 'green.200' : 'transparent'}
			onChange={handleChange}
			value={value}
			size="sm">
			{
				Object.values(OrderStatus).map(r => (
					<option key={r} value={r}>{r}</option>
				))
			}
		</Select>
	);
};

export default StatusSelect;
