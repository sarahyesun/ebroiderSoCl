import {Suspense} from 'react';
import Layout from 'app/layouts/Layout';
import {
	Link,
	useRouter,
	useQuery,
	useParam,
	BlitzPage,
	useMutation
} from 'blitz';
import {Heading, Text, Grid, Container, Box, Spacer, Button, VStack, Wrap, WrapItem, HStack, IconButton} from '@chakra-ui/react';
import getDesign from 'app/designs/queries/getDesign';
import deleteDesign from 'app/designs/mutations/deleteDesign';
import {EditIcon} from '@chakra-ui/icons';

export const Design = () => {
	const router = useRouter();
	const designId = useParam('designId', 'number');
	const [design] = useQuery(getDesign, {where: {id: designId}});
	const [deleteDesignMutation] = useMutation(deleteDesign);

	return (
		<Grid templateColumns="40% 1fr" gap={24}>
			<img src={`/api/uploads/${design.stitchFileId}.svg`} width="100%"/>

			<VStack align="flex-start">
				<HStack>
					<Heading size="2xl" mb={2}>{design.name}</Heading>

					<Spacer minWidth={6}/>

					<Link href={`/designs/${design.id}/edit`} passHref>
						<IconButton icon={<EditIcon/>} aria-label="edit design" as="a"/>
					</Link>
				</HStack>

				<Heading size="md">$24.99</Heading>

				<Spacer height={6} flexGrow={0}/>

				<Text>
					{design.description}
				</Text>

				<Spacer flexGrow={1}/>

				<Wrap spacing={4}>
					<WrapItem>
						<Button colorScheme="blue">Add to cart</Button>
					</WrapItem>

					<WrapItem>
						<Button>Download files</Button>
					</WrapItem>
				</Wrap>
			</VStack>
		</Grid>
	);
};

const ShowDesignPage: BlitzPage = () => {
	return (
		<Container size="lg" mt={24}>
			<Suspense fallback={<div>Loading...</div>}>
				<Design />
			</Suspense>
		</Container>
	);
};

ShowDesignPage.getLayout = page => <Layout title={'Design'}>{page}</Layout>;

export default ShowDesignPage;
