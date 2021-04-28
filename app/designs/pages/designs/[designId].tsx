import {Suspense, useState, useCallback} from 'react';
import Layout from 'app/layouts/Layout';
import {
	Link,
	useQuery,
	useParam,
	BlitzPage,
	useSession,
	Image,
	useRouter
} from 'blitz';
import {
	Heading,
	Text,
	Grid,
	Container,
	Box,
	Spacer,
	Button,
	VStack,
	Wrap,
	WrapItem,
	HStack,
	IconButton,
	useTimeout
} from '@chakra-ui/react';
import getDesign from 'app/designs/queries/getDesign';
import {CheckIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon} from '@chakra-ui/icons';
import getUploadPreviewUrl from 'utils/get-upload-preview-url';
import {useCart} from 'app/hooks/useCart';
import {useCurrentUser} from 'app/hooks/useCurrentUser';

const currencyFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

export const Design = () => {
	const [isCartAddSuccessful, setIsCartAddSuccessful] = useState(false);
	const router = useRouter();
	const currentUser = useCurrentUser();
	const {addDesignIdToCart} = useCart();
	const [currentPictureIndex, setCurrentPictureIndex] = useState(0);
	const designId = useParam('designId', 'number');
	const [design] = useQuery(getDesign, {where: {id: designId}});

	const session = useSession();
	const canEditDesign = session.roles?.includes('ADMIN') === true || design.userId === session.userId;

	const handleCartAdd = useCallback(async () => {
		if (!currentUser) {
			await router.push(`/login?redirect=/designs/${designId!}`);
			return;
		}

		await addDesignIdToCart(designId!);
		setIsCartAddSuccessful(true);
	}, [addDesignIdToCart, designId, currentUser]);

	useTimeout(() => {
		setIsCartAddSuccessful(false);
	}, isCartAddSuccessful ? 2000 : null);

	return (
		<Grid templateColumns={{sm: '1fr', md: '40% 1fr'}} templateRows={{sm: '1fr 1fr', md: '1fr'}} gap={24}>
			<VStack>
				<Box h="30vh" d="flex" position="relative" w="full">
					<Image src={design.pictures.length > 0 ? getUploadPreviewUrl(design.pictures[currentPictureIndex].id) : getUploadPreviewUrl(design.files.find(f => f.type === 'image/svg+xml')!.id, 'svg')} objectFit="contain" layout="fill"/>
				</Box>

				{
					design.pictures.length > 0 && (
						<HStack w="full">
							<IconButton
								onClick={() => {
									setCurrentPictureIndex(i => i - 1);
								}}
								disabled={currentPictureIndex === 0}
								icon={<ChevronLeftIcon/>}
								aria-label="Previous image"
								variant="outline"/>

							{Array.from(Array.from({length: 3}).keys()).map(i =>
								design.pictures.length > (i + currentPictureIndex) ? (
									<Box flexBasis={0} flexGrow={1} d="flex" position="relative" h="20vh" key={i}>
										<Image src={getUploadPreviewUrl(design.pictures[i + currentPictureIndex].id)} layout="fill" objectFit="contain"/>
									</Box>
								) : (
									<Box flexBasis={0} flexGrow={1} d="flex" position="relative" h="20vh" key={i}/>
								)
							)}

							<IconButton
								icon={<ChevronRightIcon/>}
								aria-label="Next image"
								variant="outline"
								disabled={currentPictureIndex === design.pictures.length - 1}
								onClick={() => {
									setCurrentPictureIndex(i => i + 1);
								}}
							/>
						</HStack>
					)
				}

			</VStack>

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

				<Heading size="md" mb={2}>{currencyFormat.format(design.price / 100)}</Heading>

				<Text mb={6}>
					{design.description}
				</Text>

				<Wrap spacing={4}>
					<WrapItem>
						<Button
							colorScheme={isCartAddSuccessful ? 'green' : 'blue'}
							onClick={handleCartAdd}
							leftIcon={isCartAddSuccessful ? <CheckIcon/> : undefined}>Add to cart</Button>
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
