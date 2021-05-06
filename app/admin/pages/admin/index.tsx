import React from 'react';
import Layout from 'app/layouts/Layout';
import {Link, BlitzPage} from 'blitz';
import {
	Button,
	VStack
} from '@chakra-ui/react';

const AdminPage: BlitzPage = () => {
	return (
		<VStack spacing={6} alignItems="flex-start">
			<Link href="/admin/orders" passHref>
				<Button as="a" size="lg" colorScheme="blue" variant="link" fontSize={24}>Manage Orders</Button>
			</Link>

			<Link href="/admin/designs" passHref>
				<Button as="a" size="lg" colorScheme="blue" variant="link" fontSize={24}>Pending Public Designs</Button>
			</Link>

			<Link href="/admin/users" passHref>
				<Button as="a" size="lg" colorScheme="blue" variant="link" fontSize={24}>Manage Users</Button>
			</Link>
		</VStack>
	);
};

AdminPage.getLayout = page => <Layout title={'Admin'} header="Admin" bg="gray.50">{page}</Layout>;
AdminPage.authenticate = true;

export default AdminPage;
