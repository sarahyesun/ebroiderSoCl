import {
	Link as DisplayLink,
	LinkProps as DisplayLinkProps
} from '@chakra-ui/react';
import {Link, LinkProps} from 'blitz';

const WrappedLink = ({
	children,
	boxProps,
	...props
}: LinkProps & { children: string; boxProps?: DisplayLinkProps }) => (
	<Link {...props} passHref>
		<DisplayLink color="blue.400" {...boxProps}>{children}</DisplayLink>
	</Link>
);

export default WrappedLink;
