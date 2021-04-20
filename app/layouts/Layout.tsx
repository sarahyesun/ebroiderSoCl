import {ReactNode} from 'react';
import {Head} from 'blitz';
import {Box, BoxProps} from '@chakra-ui/react';
import Navbar from './navbar';

type LayoutProps = {
	title?: string;
	children: ReactNode;
} & BoxProps;

const Layout = ({title, children, ...rest}: LayoutProps) => {
	return (
		<>
			<Head>
				<title>{title ?? 'WearableElectronicsFactory'}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Navbar />

			<Box pt={10} minH="100vh" {...rest}>
				{children}
			</Box>
		</>
	);
};

export default Layout;
