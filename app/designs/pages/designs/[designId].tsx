import {Suspense} from 'react';
import Layout from 'app/layouts/Layout';
import {
	Link,
	useQuery,
	useParam,
	BlitzPage,
	useSession
} from 'blitz';
import {Heading, Text, Grid, Container, Box, Spacer, Button, VStack, Wrap, WrapItem, HStack, IconButton} from '@chakra-ui/react';
import getDesign from 'app/designs/queries/getDesign';
import {EditIcon} from '@chakra-ui/icons';
import getUploadPreviewUrl from 'utils/get-upload-preview-url';

export const Design = () => {
	const designId = useParam('designId', 'number');
	const [design] = useQuery(getDesign, {where: {id: designId}});

	const session = useSession();
	const canEditDesign = session.roles?.includes('ADMIN') === true || design.userId === session.userId;

	return (
		<Grid templateColumns="40% 1fr" gap={24}>
			<img src={getUploadPreviewUrl(design.stitchFileId, 'svg')} width="100%"/>

			<VStack align="flex-start">
				<HStack>
					<Heading size="2xl" mb={2}>{design.name}</Heading>

					<Spacer minWidth={6}/>

					{
						canEditDesign && (
							<Link href={`/designs/${design.id}/edit`} passHref>
								<IconButton icon={<EditIcon/>} aria-label="edit design" as="a"/>
							</Link>
						)
					}

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
						<Link href={`/api/designs/${design.id}/download`} passHref>
							<Button as="a" download>Download files</Button>
						</Link>
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
