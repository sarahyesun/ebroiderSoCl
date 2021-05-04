import React from 'react';
import Layout from 'app/layouts/Layout';
import {Link, BlitzPage, dynamic} from 'blitz';
import {
	Heading,
	Box,
	Text,
	Container,
	Button,
	VStack
} from '@chakra-ui/react';
const Confetti = dynamic(async () => import('react-confetti'), {ssr: false});

const CheckoutSuccess: BlitzPage = () => {
	return (
		<>
			<VStack spacing={6} alignItems="flex-start">
				<Text>Thank you! You should receive a confirmation email soon.</Text>

				<Link href="/orders/mine" passHref>
					<Button as="a" colorScheme="blue" variant="link" fontSize={24}>View Orders</Button>
				</Link>
			</VStack>
			<Confetti
				recycle={false}
			/>
		</>
	);
};

CheckoutSuccess.getLayout = page => <Layout title={'Order Completed!'} bg="gray.50" header="Order Placed!">{page}</Layout>;

export default CheckoutSuccess;
