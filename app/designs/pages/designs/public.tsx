import React, {Suspense} from 'react';
import Layout from 'app/layouts/Layout';
import {Link, usePaginatedQuery, useRouter, BlitzPage} from 'blitz';
import getPublicDesigns from 'app/designs/queries/getPublicDesigns';
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
import {useCurrentUser} from 'app/hooks/useCurrentUser';

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
	const [{designs, hasMore}] = usePaginatedQuery(getPublicDesigns, {
		orderBy: {id: 'asc'},
		skip: ITEMS_PER_PAGE * page,
		take: ITEMS_PER_PAGE
	});

	const goToPreviousPage = async () =>
		router.push({query: {page: page - 1}});
	const goToNextPage = async () => router.push({query: {page: page + 1}});

	return (
		<VStack spacing={10} align="flex-start">
			<Wrap spacing={10}>
				{designs.map(design => (
					<WrapItem key={design.id}>
						<DesignCard
							design={design}
							pictureId={design.pictures.length > 0 ? design.pictures[0].id : undefined}
							fallbackFileId={design.files.find(f => f.type === 'image/svg+xml')?.id ?? ''}/>
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

const NewDesignButton = () => {
	const user = useCurrentUser();

	if (user) {
		return (
			<Link href="/designs/new" passHref>
				<Button
					leftIcon={<FontAwesomeIcon icon={faPlus} />}
					colorScheme="blue"
					as="a"
				>
            New Design
				</Button>
			</Link>
		);
	}

	return null;
};

const DesignsPage: BlitzPage = () => {
	return (
		<Suspense fallback={<DesignsListPlaceholder />}>
			<DesignsList />
		</Suspense>
	);
};

DesignsPage.getLayout = page => <Layout
	title={'Public Designs'}
	header="Public Designs"
	rightAction={(
		<Suspense fallback={<div/>}>
			<NewDesignButton/>
		</Suspense>
	)}>
	{page}
</Layout>;

export default DesignsPage;
