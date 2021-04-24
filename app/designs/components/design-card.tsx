import {LinkBox, LinkOverlay, Box, Text, Skeleton, Tag, Wrap, WrapItem} from '@chakra-ui/react';
import {Design} from '@prisma/client';
import {Link, Image} from 'blitz';
import getUploadPreviewUrl from 'utils/get-upload-preview-url';

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

const DesignCard = ({design, tags = [], pictureId, fallbackFileId}: { design?: Design; tags?: string[]; pictureId?: string; fallbackFileId?: string }) => {
	const loaded = design !== undefined;

	return (
		<LinkBox>
			<Link href={`/designs/${design?.id ?? 0}`} passHref>
				<LinkOverlay
					display="flex"
					flexDirection="column"
					width="15rem"
					height="21rem"
				>
					<Skeleton
						isLoaded={loaded}
						width="15rem"
						height="18rem"
						position="relative"
						rounded="sm"
						overflow="hidden"
						bg={(pictureId || fallbackFileId) ? 'transparent' : 'gray.50'}
					>
						{(pictureId || fallbackFileId) && (
							<Image
								src={getUploadPreviewUrl(pictureId ?? fallbackFileId!, pictureId ? undefined : 'svg')}
								alt="Design preview"
								layout="fill"
								objectFit="contain"
							/>
						)}

						<Wrap position="absolute" m={2}>
							{
								tags.map(tag => (
									<WrapItem key={tag}>
										<Tag>{tag}</Tag>
									</WrapItem>
								))
							}
						</Wrap>
					</Skeleton>

					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						fontSize={20}
						flexGrow={1}
					>
						<Skeleton isLoaded={loaded} minWidth={0}>
							<Text
								fontWeight="bold"
								textOverflow="ellipsis"
								overflow="hidden"
								whiteSpace="nowrap"
							>
								{design?.name}
							</Text>
						</Skeleton>

						<Skeleton isLoaded={loaded}>
							<Text>
								{currencyFormatter.format((design?.price ?? 0) / 100)}
							</Text>
						</Skeleton>
					</Box>
				</LinkOverlay>
			</Link>
		</LinkBox>
	);
};

export default DesignCard;
