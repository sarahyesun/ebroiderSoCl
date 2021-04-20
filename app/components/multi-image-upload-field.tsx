import React, {useCallback, useMemo, useState} from 'react';
import {HStack, Spacer, Stack, VStack} from '@chakra-ui/layout';
import {useField} from 'react-final-form';
import {Button, IconButton} from '@chakra-ui/button';
import {ChevronLeftIcon, ChevronRightIcon, DeleteIcon, AddIcon, ArrowLeftIcon, ArrowRightIcon} from '@chakra-ui/icons';
import {Text, Box} from '@chakra-ui/react';
import getUploadPreviewUrl from 'utils/get-upload-preview-url';

const fileListToArray = (list: FileList) => {
	const array: File[] = [];

	// eslint-disable-next-line prefer-spread
	array.push.apply(array, list);

	return array;
};

const MultiImageUploadField = ({name}: {name: string}) => {
	const [currentPictureIndex, setCurrentPictureIndex] = useState(0);

	const {
		input: {value: pictures, onChange}
	} = useField(name);

	const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			onChange([
				...pictures,
				...fileListToArray(event.target.files ?? new FileList())
			]);
		}
	}, [pictures]);

	const handleCurrentPictureRemove = useCallback(() => {
		onChange([...pictures.slice(0, currentPictureIndex), ...pictures.slice(currentPictureIndex + 1)]);
		setCurrentPictureIndex(i => i === 0 ? 0 : i - 1);
	}, [currentPictureIndex, pictures]);

	const handleCurrentPictureMoveForward = useCallback(() => {
		onChange([
			...pictures.slice(0, currentPictureIndex),
			pictures[currentPictureIndex + 1],
			pictures[currentPictureIndex],
			...pictures.slice(currentPictureIndex + 2)
		]);
		setCurrentPictureIndex(i => i + 1);
	}, [currentPictureIndex, pictures]);

	const handleCurrentPictureMoveBackward = useCallback(() => {
		onChange([
			...pictures.slice(0, currentPictureIndex - 1),
			pictures[currentPictureIndex],
			pictures[currentPictureIndex - 1],
			...pictures.slice(currentPictureIndex + 1)
		]);
		setCurrentPictureIndex(i => i - 1);
	}, [currentPictureIndex, pictures]);

	const currentPictureSrc = useMemo(() => {
		const current = pictures[currentPictureIndex];

		if (!current) {
			return null;
		}

		if (current.constructor === File) {
			return URL.createObjectURL(current);
		}

		return getUploadPreviewUrl(current);
	}, [pictures, currentPictureIndex]);

	return (
		<Stack>
			{
				currentPictureSrc && (
					<VStack w="full">
						<Box overflow="hidden" height="30vh">
							<img src={currentPictureSrc} style={{height: '100%', width: 'auto', objectFit: 'contain'}}/>
						</Box>
						<HStack>
							<Spacer/>
							<Text fontWeight="bold">{currentPictureIndex + 1} of {pictures.length}</Text>
						</HStack>

						<HStack w="full">
							<IconButton
								aria-label="Previous picture"
								icon={<ChevronLeftIcon/>}
								disabled={currentPictureIndex === 0}
								onClick={() => {
									setCurrentPictureIndex(i => i - 1);
								}}/>

							<Spacer/>

							<IconButton
								aria-label="Move picture left"
								icon={<ArrowLeftIcon/>}
								title="Move picture left"
								disabled={currentPictureIndex === 0}
								onClick={handleCurrentPictureMoveBackward}
							/>

							<Button
								colorScheme="red"
								leftIcon={<DeleteIcon/>}
								onClick={handleCurrentPictureRemove}>
                Remove Image
							</Button>

							<IconButton
								aria-label="Move picture right"
								icon={<ArrowRightIcon/>}
								title="Move picture right"
								disabled={currentPictureIndex === pictures.length - 1 || pictures.length === 0}
								onClick={handleCurrentPictureMoveForward}/>

							<Spacer/>

							<IconButton
								aria-label="Next picture"
								icon={<ChevronRightIcon/>}
								disabled={currentPictureIndex === pictures.length - 1 || pictures.length === 0}
								onClick={() => {
									setCurrentPictureIndex(i => i + 1);
								}}/>
						</HStack>
					</VStack>
				)
			}

			<input
				type="file"
				id={name}
				style={{display: 'none'}}
				accept="image/png,image/jpeg"
				multiple
				onChange={handleInputChange}
			/>

			<Button
				as="label"
				htmlFor={name}
				colorScheme="green"
				leftIcon={<AddIcon/>}
				_hover={{cursor: 'pointer'}}>
        Add Images
			</Button>
		</Stack>
	);
};

export default MultiImageUploadField;
