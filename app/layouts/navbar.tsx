import React, {Suspense, useCallback, useState} from 'react';
import {Flex, Heading, Box, Button} from '@chakra-ui/react';
import {Link, useMutation, useRouter, useSession} from 'blitz';
import WrappedLink from 'app/components/link';
import logout from 'app/auth/mutations/logout';
import CartButton from 'app/cart/components/cart-button';

const AuthenticatedLinks = ({show}: { show: boolean }) => {
	const {userId, roles} = useSession();

	if (!userId) {
		return null;
	}

	const links = [
		{
			href: '/designs/generate',
			label: 'Generate a Design'
		},
		{
			href: '/designs',
			label: 'My Designs'
		},
		{
			href: '/orders',
			label: 'My Orders'
		}
	];

	if (roles?.includes('ADMIN')) {
		links.push({
			href: '/admin',
			label: 'Admin'
		});
	}

	return (
		<>
			<Box
				display={{sm: show ? 'block' : 'none', md: 'block'}}
				mt={{base: 4, md: 0}}
			>
				{links.map(link => (
					<WrappedLink key={link.href} href={link.href} boxProps={{mr: 5}}>
						{link.label}
					</WrappedLink>
				))}
			</Box>

			<CartButton/>
		</>
	);
};

const LoginButtons = ({
	onLogout,
	loggedIn
}: {
	onLogout: () => void;
	loggedIn: boolean;
}) => {
	if (loggedIn) {
		return (
			<Button colorScheme="blue" onClick={onLogout} variant="link" size="lg">
        Logout
			</Button>
		);
	}

	return (
		<>
			<Button colorScheme="blue" variant="link" size="lg" mr={5}>
				<WrappedLink href="/login">Login</WrappedLink>
			</Button>
			<Button colorScheme="blue" variant="link" size="lg">
				<WrappedLink href="/signup">Signup</WrappedLink>
			</Button>
		</>
	);
};

const LoginButtonsWrapper = () => {
	const {userId} = useSession();
	const [logoutMutation] = useMutation(logout);
	const router = useRouter();

	const handleLogout = useCallback(async () => {
		await logoutMutation();
		await router.push('/');
	}, [logoutMutation]);

	return (
		<LoginButtons onLogout={handleLogout} loggedIn={Boolean(userId)} />
	);
};

const Navbar = () => {
	const [show, setShow] = useState(false);
	const handleToggle = () => {
		setShow(!show);
	};

	return (
		<Flex
			as="nav"
			align="center"
			justify="space-between"
			wrap="wrap"
			padding={6}
			bg="black"
			color="white"
			zIndex={10}
			position="relative"
			fontWeight="bold"
		>
			<Flex align="center" mr={5}>
				<Link passHref href="/">
					<Heading as="a" size="lg">
						SoCl
					</Heading>
				</Link>
			</Flex>

			<Box display={{base: 'block', md: 'none'}} onClick={handleToggle}>
				<svg
					fill="white"
					width="12px"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Menu</title>
					<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
				</svg>
			</Box>

			<Box
				display={{sm: show ? 'block' : 'none', md: 'flex'}}
				width={{sm: 'full', md: 'auto'}}
				alignItems="center"
				flexGrow={1}
			>
				<WrappedLink href="/designs/public">Design Library</WrappedLink>
			</Box>

			<Box
				display={{sm: show ? 'block' : 'none', md: 'flex'}}
				alignItems="center"
			>
				<Suspense fallback={<div />}>
					<AuthenticatedLinks show={show} />
				</Suspense>

				<Suspense
					fallback={
						<LoginButtons
							loggedIn={false}
							onLogout={() => {
								/* Do nothing */
							}}
						/>
					}
				>
					<LoginButtonsWrapper />
				</Suspense>
			</Box>
		</Flex>
	);
};

export default Navbar;
