import React from 'react';
import {useField} from 'react-final-form';
import {Button, Box, FormErrorMessage, FormControl} from '@chakra-ui/react';
import {ArrowUpIcon} from '@chakra-ui/icons';

type ImageUploadFieldProps = {
	label: string;
	name: string;
};

const cloneFileList = (list: FileList) => {
	const newList: File[] = [];

	// eslint-disable-next-line prefer-spread
	newList.push.apply(newList, list);

	return newList;
};

const ImageUploadField = (props: ImageUploadFieldProps) => {
	const {
		input: {value, onChange, ...input},
		meta: {error, submitError, touched, submitting}
	} = useField(props.name);

	const normalizedError = error ?
		error.join(', ') :
		error || submitError;

	return (
		<FormControl isInvalid={normalizedError && touched}>
			<input
				{...input}
				onChange={({target}) => {
					onChange(cloneFileList(target.files ?? new FileList()));
				}}
				type="file"
				id={props.name}
				style={{display: 'none'}}
				accept="image/png,image/jpeg"
			/>

			<FormErrorMessage>{normalizedError}</FormErrorMessage>

			<Button
				isFullWidth
				leftIcon={<ArrowUpIcon />}
				htmlFor={props.name}
				as="label"
				_hover={{cursor: 'pointer'}}
				disabled={submitting}
				colorScheme="green"
			>
				{props.label}
			</Button>
		</FormControl>
	);
};

export default ImageUploadField;
