import React, {Suspense} from 'react';
import Layout from 'app/layouts/Layout';
import {Link, usePaginatedQuery, useRouter, BlitzPage, Routes} from 'blitz';
import {
	Heading,
	Box,
	Text,
	Container,
	HStack,
	Spacer,
	IconButton,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Tag,
	TableCaption,
	Button,
	VStack
} from '@chakra-ui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
	faAngleDoubleLeft,
	faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import {EditIcon} from '@chakra-ui/icons';
import getDesigns from 'app/designs/queries/getDesigns';
import WrappedLink from 'app/components/link';

const ITEMS_PER_PAGE = 10;

const currencyFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

export const DesignsList = () => {
	const router = useRouter();
	const page = Number(router.query.page) || 0;
	const [{designs, hasMore}] = usePaginatedQuery(getDesigns, {
		orderBy: {createdAt: 'desc'},
		where: {isPublic: true},
		skip: ITEMS_PER_PAGE * page,
		take: ITEMS_PER_PAGE
	});

	const goToPreviousPage = async () =>
		router.push({query: {page: page - 1}});
	const goToNextPage = async () => router.push({query: {page: page + 1}});

	return (
		<Table shadow="md" bg="white">
			<Thead>
				<Tr>
					<Th>Name</Th>
					<Th>Description</Th>
					<Th>Status</Th>
					<Th isNumeric>Price</Th>
					<Th>Edit</Th>
				</Tr>
			</Thead>

			<Tbody>
				{designs.map(design => (
					<Tr key={design.id}>
						<Td w="30%">
							<WrappedLink href={`/designs/${design.id}`}>
								{design.name}
							</WrappedLink>
						</Td>
						<Td w="full">
							<Text noOfLines={1}>
								{design.description}
							</Text>
						</Td>
						<Td>
							{design.isPublic && design.isApproved && <Tag colorScheme="green">Public</Tag>}
							{design.isPublic && !design.isApproved && <Tag colorScheme="yellow">Unapproved</Tag>}
						</Td>
						<Td isNumeric>{currencyFormat.format(design.price / 100)}</Td>
						<Th>
							<Link passHref href={`/designs/${design.id}/edit?redirect=/admin`}>
								<IconButton aria-label="Edit design" icon={<EditIcon/>} colorScheme="gray" size="sm" as="a"/>
							</Link>
						</Th>
					</Tr>
				))}
			</Tbody>

			<TableCaption>
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
			</TableCaption>
		</Table>
	);
};

const AdminPage: BlitzPage = () => {
	return (
		<VStack spacing={6} alignItems="flex-start">
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
