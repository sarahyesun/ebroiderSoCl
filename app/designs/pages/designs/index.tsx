import React, {Suspense} from 'react';
import Layout from 'app/layouts/Layout';
import {Link, usePaginatedQuery, useRouter, BlitzPage} from 'blitz';
import getMyDesigns from 'app/designs/queries/getMyDesigns';
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
	IconButton,
	Text
} from '@chakra-ui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
	faAngleDoubleLeft,
	faAngleDoubleRight,
	faPlus
} from '@fortawesome/free-solid-svg-icons';
import DesignCard from 'app/designs/components/design-card';
import {Design} from 'db';

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

const getTags = (design: Design) => {
	const tags: string[] = [];

	if (design.isPublic) {
		if (design.isApproved) {
			tags.push('Public');
		} else {
			tags.push('Pending Approval');
		}
	}

	return tags;
};

export const DesignsList: BlitzPage = () => {
	const router = useRouter();
	const page = Number(router.query.page) || 0;
	const [{designs, hasMore}] = usePaginatedQuery(getMyDesigns, {
		orderBy: {id: 'asc'},
		skip: ITEMS_PER_PAGE * page,
		take: ITEMS_PER_PAGE
	});

	const goToPreviousPage = async () =>
		router.push({query: {page: page - 1}});
	const goToNextPage = async () => router.push({query: {page: page + 1}});

	return (
		<VStack spacing={10} align="flex-start">
			{
				designs.length === 0 && page === 0 && (
					<Text w="full" textAlign="center" color="gray.500" fontWeight="bold" mt={10}>There's nothing here yet.</Text>
				)
			}

			<Wrap spacing={10}>
				{designs.map(design => (
					<WrapItem key={design.id}>
						<DesignCard design={design} tags={getTags(design)} pictureId={design.pictures.length > 0 ? design.pictures[0].id : undefined}/>
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
DesignsPage.authenticate = true;

export default DesignsPage;
