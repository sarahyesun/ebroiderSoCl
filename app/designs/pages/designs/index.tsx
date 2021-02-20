import React, {Suspense} from 'react';
import Layout from 'app/layouts/Layout';
import {Link, usePaginatedQuery, useRouter, BlitzPage} from 'blitz';
import getDesigns from 'app/designs/queries/getDesigns';
import {
	Heading,
	Box,
	Button,
	Container,
	Wrap,
	WrapItem,
	VStack,
	HStack,
	Spacer,
	IconButton
} from '@chakra-ui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
	faAngleDoubleLeft,
	faAngleDoubleRight,
	faPlus
} from '@fortawesome/free-solid-svg-icons';
import DesignCard from 'app/designs/components/design-card';

const ITEMS_PER_PAGE = 10;

const DesignsListPlaceholder = () => (
	<Wrap spacing={10}>
		{Array.from(Array.from({length: 4}).keys()).map(i => (
			<WrapItem key={i}>
				<DesignCard />
			</WrapItem>
		))}
	</Wrap>
);

export const DesignsList = () => {
	const router = useRouter();
	const page = Number(router.query.page) || 0;
	const [{designs, hasMore}] = usePaginatedQuery(getDesigns, {
		orderBy: {id: 'asc'},
		skip: ITEMS_PER_PAGE * page,
		take: ITEMS_PER_PAGE
	});

	const goToPreviousPage = async () =>
		router.push({query: {page: page - 1}});
	const goToNextPage = async () => router.push({query: {page: page + 1}});

	return (
		<VStack spacing={10}>
			<Wrap spacing={10}>
				{designs.map(design => (
					<WrapItem key={design.id}>
						<DesignCard design={design} />
					</WrapItem>
				))}
			</Wrap>
			<HStack width="100%">
				{page !== 0 && (
					<IconButton aria-label="Previous page" onClick={goToPreviousPage}>
						<FontAwesomeIcon icon={faAngleDoubleLeft} />
					</IconButton>
				)}

				<Spacer />

				{hasMore && (
					<IconButton aria-label="Next page" onClick={goToNextPage}>
						<FontAwesomeIcon icon={faAngleDoubleRight} />
					</IconButton>
				)}
			</HStack>
		</VStack>
	);
};

const DesignsPage: BlitzPage = () => {
	return (
		<Container size="lg">
			<Box justifyContent="space-between" flexGrow={1} display="flex" mb={10}>
				<Heading>My Designs</Heading>

				<Link href="/designs/new" passHref>
					<Button
						leftIcon={<FontAwesomeIcon icon={faPlus} />}
						colorScheme="blue"
						as="a"
					>
            New Design
					</Button>
				</Link>
			</Box>

			<Suspense fallback={<DesignsListPlaceholder />}>
				<DesignsList />
			</Suspense>
		</Container>
	);
};

DesignsPage.getLayout = page => <Layout title={'Designs'}>{page}</Layout>;

export default DesignsPage;
