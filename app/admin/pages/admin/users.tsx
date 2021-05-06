import React, {Suspense, useCallback, useState} from 'react';
import {BlitzPage, useMutation, useInfiniteQuery} from 'blitz';
import {Box, Tbody, Table, Th, Thead, Tr, Td, Input, Select, useTimeout, Button} from '@chakra-ui/react';
import Layout from 'app/layouts/Layout';
import getUsers from 'app/users/queries/getUsers';
import Gravatar from 'react-gravatar';
import {Role} from 'db';
import updateUser from 'app/users/mutations/updateUser';

const UserRoleSelect = ({userId, currentRole}: {userId: number; currentRole: Role}) => {
	const [updateUserMutation, {isLoading, isSuccess}] = useMutation(updateUser);
	const [value, setValue] = useState(currentRole);
	const [changeSuccess, setChangeSuccess] = useState(false);

	useTimeout(() => {
		setChangeSuccess(false);
	}, isSuccess ? 500 : null);

	const handleChange = useCallback(async (event: React.ChangeEvent<HTMLSelectElement>) => {
		const result = await updateUserMutation({where: {id: userId}, data: {role: event.target.value as Role}});

		setValue(result.role);
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
				Object.values(Role).map(r => (
					<option key={r} value={r}>{r}</option>
				))
			}
		</Select>
	);
};

const UsersList = ({query}: {query: string}) => {
	const [
		userPages,
		{isFetchingNextPage, fetchNextPage, hasNextPage}
	] = useInfiniteQuery(getUsers, ({take, skip} = {take: 10, skip: 0}) => ({
		query: query === '' ? undefined : query,
		take,
		skip
	}), {
		keepPreviousData: true,
		getNextPageParam: lastPage => lastPage.nextPage
	});

	return (
		<>
			<Table shadow="md" bg="white">
				<Thead>
					<Tr>
						<Th>Name</Th>
						<Th>Email</Th>
						<Th>Role</Th>
					</Tr>
				</Thead>
				<Tbody>
					{
						userPages.map(userPage => userPage.users.map(user => (
							<Tr key={user.id}>
								<Td>
									<Box d="flex" alignItems="center">
										<Box rounded="full" overflow="hidden" w="24px" h="24px" mr={2}>
											<Gravatar email={user.email} size={24}/>
										</Box>
										{user.name}
									</Box>
								</Td>
								<Td>{user.email}</Td>
								<Td>
									<UserRoleSelect userId={user.id} currentRole={user.role}/>
								</Td>
							</Tr>
						)))
					}
				</Tbody>
			</Table>
			{
				hasNextPage && (
					<Button onClick={async () => fetchNextPage()} disabled={Boolean(isFetchingNextPage)} isFullWidth mt={4}>
          Load More
					</Button>
				)
			}
		</>
	);
};

const UsersPage: BlitzPage = () => {
	const [query, setQuery] = useState('');

	return (
		<>
			<Box bg="white" rounded="md" shadow="md" mb={4}>
				<Input placeholder="Search by name or email..." size="lg" value={query} onChange={event => {
					setQuery(event.target.value);
				}}/>
			</Box>

			<Suspense fallback={<div/>}>
				<UsersList query={query}/>
			</Suspense>
		</>
	);
};

UsersPage.getLayout = page => <Layout title={'Manage Users'} header="Users" bg="gray.50">{page}</Layout>;
UsersPage.authenticate = true;

export default UsersPage;
