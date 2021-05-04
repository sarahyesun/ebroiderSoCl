import {ReactNode} from 'react';
import {Head} from 'blitz';
import {Box, BoxProps, Container, Heading} from '@chakra-ui/react';
import Navbar from './navbar';

type LayoutProps = {
	title?: string;
	header?: string;
	rightAction?: ReactNode;
	children: ReactNode;
} & BoxProps;

const Layout = ({title, header, rightAction, children, ...rest}: LayoutProps) => {
	return (
		<>
			<Head>
				<title>{title ?? 'WearableElectronicsFactory'}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Navbar />

			<Box pt={10} minH="100vh" {...rest}>
				{header ? (
					<Container size="lg">
						<Box justifyContent="space-between" flexGrow={1} display="flex" mb={10}>
							<Heading>{header}</Heading>

							{rightAction}
						</Box>

						{children}
					</Container>
				) : children}
			</Box>
		</>
	);
};

export default Layout;
